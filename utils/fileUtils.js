require("dotenv").config();
const moment = require("moment");

const URL_FIREBASE_DB = process.env.URL_FIREBASE_DB;

const Petitions = require("./petitions");
const cards = require("./cards");
const isEmail = require("is-email");
const {
  containsSpecialChars,
  isValidDate,
  isValidPhone
} = require("./validators");
const {
  encryptCreditCardNumber,
  decryptCreditCardNumber,
  showLastFourDigits
} = require("../utils/encrypt");

const Contact = require("../models/contact")

const processFiles = (files) => {
  files.map(file => {
    let headers = file.headers
    let contacts = file.contacts;
    let rows = contacts.split("\r\n");

    let contactsParsed = [];
    rows.shift()
    rows.map(contact => {
      let item = contact.split(",");
      let contactObj = {};
      headers.forEach((colum, i) => {
        contactObj[colum] = item[i];
      });
      franchiseFound = cards.find(
        card => card.number == contactObj.credit_card
      );
      if (franchiseFound) contactObj["franchise"] = franchiseFound.type;
      else contactObj["franchise"] = "";
      contactObj.errors = [];
      contactsParsed.push(contactObj);
    });

    let validationRes = validateContacts(contactsParsed);

    file.contacts = validationRes;
  });
  return files;
};

const validateContacts = contacts => {
  contacts.map(contact => {
    if (containsSpecialChars(contact.name)) {
      contact["errors"].push("The name must not have special characters");
    }
    if (contact.name === "") {
      contact["errors"].push("The name can not be empty");
    }
    if (!isValidDate(contact.dof))
      contact["errors"].push(
        "The Date of birth should be yyyymmdd or yyyy-mm-dd"
      );
    if (!isValidPhone(contact.phone))
      contact["errors"].push(
        "The phone has to be in format (+00) 000 000 00 00 or (+00) 000-000-00-00"
      );
    if (contact.address === "") {
      contact["errors"].push("The address should not be empty");
    }

    if (contact.franchise === "") {
      contact["errors"].push("Validate the card number");
    }

    if (!isEmail(contact.email)) {
      contact["errors"].push("The email is not valid");
    } else {
      let emailsFilter = contacts.filter(item => item.email == contact.email);
      if (emailsFilter.length > 1)
        contact["errors"].push("The email exists more than once");
    }
  });
  return contacts;
};

const saveContacts = (file, storagedContacts, userToken) => {
  return new Promise((resolve, reject) => {
    let contacts = file.contacts;
    let fileName = file.fileName;

    let contactsToSave = contacts.filter(contact => contact.errors.length == 0);
    let contactsWithError = contacts.filter(
      contact => contact.errors.length > 0
    );

    let contactsPromises = [];
    if (contactsToSave.length == 0) {
      file['status'] = 'Failed'
      resolve(file);
    }else {
      
      contactsToSave.map(async (contactsToSaveItem, i) => {
        isContactFound = storagedContacts.find(
          item =>
            item.email == contactsToSaveItem.email &&
            item.user_token == userToken
        );
        if (isContactFound) {
          contactsToSaveItem.errors.push(
            "The email is already storage in other contact"
          );
        } else {
          let dateFormatted =
            moment(contactsToSaveItem.dof).format("YYYY MMMM D") + "";
          let body = {
            name: contactsToSaveItem.name,
            dof: dateFormatted,
            phone: contactsToSaveItem.phone,
            address: contactsToSaveItem.address,
            credit_card: encryptCreditCardNumber(
              contactsToSaveItem.credit_card
            ),
            franchise: contactsToSaveItem.franchise,
            email: contactsToSaveItem.email,
            file_name: fileName,
            user_token: userToken
          };

          let created = Contact.createContact(body)          
          contactsPromises.push(created);
        }
      });
    }

    return Promise.all(contactsPromises).then(resultPromises => {
      file.contacts = [...contactsToSave, ...contactsWithError];
      let contactsSize = file.contacts.length
      let contactsWithErrorFound = file.contacts.filter(
        contact => contact.errors.length > 0
      );
      if(contactsWithErrorFound.length == contactsSize)
        file['status'] = 'Failed'
      else file['status'] = 'Finished'
      resolve(file);
    });
  });
};

formatContacts = (contacts) => {
  
  contacts.map(contactItem => {
    let number = decryptCreditCardNumber(contactItem.credit_card)
    let codifyNum = showLastFourDigits(number)
    contactItem.credit_card = codifyNum
  })
  return contacts;
};

const filterContacts = (contacts, userToken) => {
  let items = contacts.filter(contact => 
    contact.user_token == userToken
  )
  items.map(item => {
    let number = decryptCreditCardNumber(item.credit_card)
    let codifyNum = showLastFourDigits(number)
    item.credit_card = codifyNum
  })
  return items
}

module.exports = {
  processFiles,
  saveContacts,
  formatContacts,
  filterContacts
};
