require("dotenv").config();
const express = require("express");
const router = new express.Router();

const fileUtils = require("../utils/fileUtils");
const Petitions = require("../utils/petitions");
const Contact = require("../models/contact")

const URL_FIREBASE_DB = process.env.URL_FIREBASE_DB;

router.post("/contacts", async (req, res) => {
  let body = req.body;
  let files = body.files;
  let userToken = body.userToken

  if(userToken == null)
  res.status(400).send({error: 'user not allowed'});


  files = fileUtils.processFiles(files);
  // let url = URL_FIREBASE_DB + "contacts.json";
  let nextToken = 0

  Contact.fetchContactsByUserToken(0, 20, userToken)
    .then(contacts => {      
      return {...contacts}
  }).then(contactsRes => {
    nextToken = 1
    let allContacts = contactsRes.items

    filesPromises = [];
    files.forEach(file => {
      const createFilePromise = fileUtils.saveContacts(file, allContacts, userToken);
      filesPromises.push(createFilePromise);
    });
    return Promise.all(filesPromises).then(files => {
      return files;
    });
  }).then(files =>{
    return Contact.fetchContactsByUserToken(0, 20, userToken)
      .then(response => {
        let payload = {...response}
        let allContacts = payload.items

        let allContactsFiltered = fileUtils.formatContacts(allContacts);
        let finalRes = {
          files,
          storagedContacts: allContactsFiltered,
          nextToken
        };
        return res.status(200).send(finalRes);
      })
  })



  
    // .then(files => {
    //   let userToken = files[0].userToken;
    //   Petitions.getRequest(url).then(response => {
    //     let allContacts = [];
    //     for (let key in response) {
    //       let contactItem = response[key];
    //       allContacts.push(contactItem);
    //     }
    //     allContactsFiltered = fileUtils.formatContacts(allContacts, userToken);

    //     let finalRes = {
    //       files,
    //       storagedContacts: allContactsFiltered
    //     };
    //     res.status(200).send(finalRes);
    //   });
    // })
    .catch(error => {
      console.log("error: ", error);
      res.status(400).send("Err in server");
    });
});
// router.post("/contacts", async (req, res) => {
//   let body = req.body;
//   let files = body.files;

//   files = fileUtils.processFiles(files);
//   let url = URL_FIREBASE_DB + "contacts.json";
//   Petitions.getRequest(url)
//     .then(response => {
//       let allContacts = [];
//       for (let key in response) {
//         let contactItem = response[key];
//         allContacts.push(contactItem);
//       }

//       return allContacts;
//     })
//     .then(allContacts => {
//       filesPromises = [];
//       files.forEach(file => {
//         const createFilePromise = fileUtils.saveContacts(file, allContacts);
//         filesPromises.push(createFilePromise);
//       });
//       return Promise.all(filesPromises).then(files => {
//         return files;
//       });
//     })
//     .then(files => {
//       let userToken = files[0].userToken;
//       Petitions.getRequest(url).then(response => {
//         let allContacts = [];
//         for (let key in response) {
//           let contactItem = response[key];
//           allContacts.push(contactItem);
//         }
//         allContactsFiltered = fileUtils.formatContacts(allContacts, userToken);

//         let finalRes = {
//           files,
//           storagedContacts: allContactsFiltered
//         };
//         res.status(200).send(finalRes);
//       });
//     })
//     .catch(error => {
//       console.log("error: ", error);
//       res.status(400).send("Err in server");
//     });
// });

router.post("/validateContacts", (req, res) => {
  let body = req.body;
  let contactsStr = body.contacts;

  if(contactsStr == "")
  res.status(204).send("No content in the file");

  let rows = contactsStr.split("\r\n");

  //TBD set validation for empty file

  if (rows.length < 2) {
    res
      .status(400)
      .send(
        "The file must have at least two rows. The 1st row is the header and 1 contact"
      );
  }

  let header = rows[0].split(",");

  if (header.length < 6) {
    res.status(400).send("The file has to have 6 columns: name, date of birth, phone, address, credit card number and email");
  }
  if (header.length > 6) {
    res.status(400).send("The file has to have at most 6 columns: name, date of birth, phone, address, credit card number and email");
  }
  res.status(200).send(header);
});

router.get("/getContacts", (req, res) => {
  let body = req.body;
  if(!req.headers.authorization)
  res.status(400).send({error: 'user not allowed'});

  let userToken = req.headers.authorization
  
  let url = URL_FIREBASE_DB + "contacts.json";
  Petitions.getRequest(url)
  .then(response => {
    let allContacts = [];
    for (let key in response) {
      let contactItem = response[key];
      allContacts.push(contactItem);
    }
    let items = fileUtils.filterContacts(allContacts, userToken)
    res.status(200).send({items });
    
  })   
  .catch(error => {    
    res.status(400).send({error});
  });

  
});

module.exports = router;
