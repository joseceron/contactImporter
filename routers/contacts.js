require('dotenv').config();
const express = require("express");
const router = new express.Router();

const fileUtils = require("../utils/fileUtils")
const Petitions = require("../utils/petitions")

const URL_FIREBASE_DB = process.env.URL_FIREBASE_DB

router.post("/contacts", async (req, res) => {
  
    let body = req.body;
    let files = body.files;    

    files = fileUtils.processFiles(files)
    let url = URL_FIREBASE_DB+ 'contacts.json'
    Petitions.getRequest(url).then(response => {
      let allContacts = []
      for(let key in response){
        let contactItem = response[key]          
        allContacts.push(contactItem)
      }

      return allContacts
    }).then(allContacts => {

      filesPromises = []
      files.forEach(file => {
        const createFilePromise = fileUtils.saveContacts(file, allContacts)
        filesPromises.push(createFilePromise)
      })
      return Promise.all(filesPromises).then(files => {         
        return files
      })
      
    })
    .then(files=>{
      let userToken = files[0].userToken
      Petitions.getRequest(url).then(response => {
        let allContacts = []
        for(let key in response){
          let contactItem = response[key]          
          allContacts.push(contactItem)
        }
        allContactsFiltered = fileUtils.formatContacts(allContacts, userToken)

        let finalRes = {
          files,
          storagedContacts: allContactsFiltered,
        }
        res.status(200).send(finalRes)
      })
    })
    .catch(error => {
      console.log('error: ', error)
      res.status(400).send('Err in server')
    })    
});

module.exports = router;
