const { sequelizeConnector } = require("./orm_manager");
const { Contact } = require("./orm_manager");
const {Op} = require('sequelize');

let createContact = contactParams => {
  return new Promise((resolve, reject) => {
    Contact.create(contactParams)
      .then(contact => {
        // console.log("contact: ", contact);
        resolve(contact.dataValues);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
};

let getContacts = (offset=0, perPage=10) => {
  return new Promise((resolve, reject) => {
    Contact
      .findAndCountAll({offset, limit: perPage})
      .then(result => {
        console.log(result)
        let response = {nexToken: 0, items: []}
        let data = []
        result.rows.forEach((item, index) => {
          item = item.dataValues
          item
        })
      })
  })
}


let fetchContacts = (offset=0, perPage=10) => { 
  return new Promise((resolve, reject) => {
      Contact
        .findAndCountAll({offset: offset, limit: perPage})
        .then((result) => {
          // console.log(result);
          let response = {'nextToken': 0,  'items': []};
          let data = [];
          result.rows.forEach((item, index) => {
            item = item.dataValues
            data.push(item)
          });
          response.items = data;
          response.nextToken = offset + result.count;
          resolve(response);
        }).catch((e) => {
            console.log(e);
            reject(null);
        });
  });
};

let fetchContactsByUserToken = (offset=0, perPage=10, userToken) => { 
  return new Promise((resolve, reject) => {
      Contact
        .findAndCountAll({
          where: {
            user_token: {
                [Op.eq]: userToken
            }
          },
          offset: offset, 
          limit: perPage
        }).then((result) => {
          // console.log(result);
          let response = {'nextToken': 0,  'items': []};
          let data = [];
          result.rows.forEach((item, index) => {
            item = item.dataValues
            data.push(item)
          });
          response.items = data;
          response.nextToken = offset + result.count;
          resolve(response);
        }).catch((e) => {
            console.log(e);
            reject(null);
        });
  });
};

module.exports = {
  createContact,
  fetchContacts,
  fetchContactsByUserToken,
};
