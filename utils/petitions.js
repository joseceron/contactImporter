const axios = require("axios");
const request = require("request");

const postRequest = (data) => {
  const options = {
    url: data.url,
    method: "POST",
    headers: {},
    body: JSON.stringify(data.body),
  };
  
  return new Promise((resolve, reject) => {
    request.post(options, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        const dataParsed = JSON.parse(body);        
        resolve(dataParsed);
      }
    });
  });
};

const getRequest = (url) => {
  // Setting URL and headers for request
  const options = {
    rejectUnauthorized: false,
    url,
    headers: {},
  };
  // Return new promise
  return new Promise(function(resolve, reject) {
    request.get(options, function(error, response, body) {
      if (error) {
        reject(error);
      } else {
        const dataParsed = JSON.parse(body);
        resolve(dataParsed);
      }
    });
  });
};

module.exports = {
  postRequest,
  getRequest,
};
