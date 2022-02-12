const request = require('supertest')
const app = require('../app')
const Petitions = require("../utils/petitions")
const URL_FIREBASE_DB = process.env.URL_FIREBASE_DB;

let user = {
  "address" : "address2",
  "credit_card" : "qd2qG730PLHIODh2uXhu6vlfEBOVOAzU2LcjIC5s",
  "dof" : "1957 December 1",
  "email" : "client2@gmail.com",
  "fileName" : "contacts7.csv",
  "franchise" : "Diners Club",
  "name" : "client2",
  "phone" : "(+57) 323-561-40-51",
  "user_token" : "ingFghPo28b4usFOj37fVUg77SP2"
}

test('Should create a new contact', (done) => {
  let payload = {
    url: URL_FIREBASE_DB + "contacts.json",
    body: user
  };

  Petitions.postRequest(payload).then(response => {    
    expect('name' in response).toBe(true)
    done()
  })

})

test('Should get contacts from DB', (done) => {
  
  let url = URL_FIREBASE_DB + "contacts.json"
  Petitions.getRequest(url).then(response => {
    expect(response!=null).toBe(true)
    done()
  })

})

let files = [ { "fileName": "contacts7.csv", "contacts": "client1,19891104,(+57) 320 561 40 51,address1,371449635398431,client1@gmail.com\r\nclient2,1957-12-01,(+57) 323-561-40-51,address2,30569309025904,client2@gmail.com\r\nclient3.,20000512,(+57) 323-561-40-51,address3,6011111111111117,client3@gmail.com\r\n,19891401,(+57) 323-561-40-511,address4,3530111333300000,client4\r\nclient5,,+57 320 672 81 72,,5555555555554444,jose@outlook.com\r\nclient6 lastname,20010928,(+0) 320 78 81 18,parker st 67 NE3300,123,lina@yahoo\r\nclient7,,,,,client1@gmail.com\r\nclient8,19891104,(+57) 310 129 10 99,address8,371449635398431,client8@gmail.com\r\nclient8,19201001,(+57) 311 109 20 17,address9,371449635398431,client9@gmail.com", "userToken": "ingFghPo28b4usFOj37fVUg77SP2" } ]
test('should process files', async() => {
  await request(app)
    .post('/contacts')
    .send({files})
    .then(res => {
      expect('files' in res && 'storagedContacts' in res)
    })
})
