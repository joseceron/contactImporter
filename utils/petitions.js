const axios = require("axios");
const request = require("request");

const postRequest = (data, logs=false) => {
  const options = {
    url: data.url,
    method: "POST",
    headers: {},
    body: JSON.stringify(data.body),
  };
  if (logs) {
    console.log("petitions-options:", options);
  }
  return new Promise((resolve, reject) => {
    request.post(options, (error, response, body) => {
      if (error) {
        console.log("petitions-error:", error);
        reject(error);
      } else {
        // console.log('body: ', body)
        // console.log(response.statusCode)
        const dataParsed = JSON.parse(body);
        if (logs) {
          console.log("petitions-resolve:", body);
        }
        resolve(dataParsed);
      }
    });
  });
};

const postRequest2 = async(data, logs=false) => {
  const options = {
    url: data.url,
    method: "POST",
    headers: {},
    body: JSON.stringify(data.body),
  };
  if (logs) {
    console.log("petitions-options:", options);
  }
  return new Promise(async(resolve, reject) => {
    request.post(options, (error, response, body) => {
      if (error) {
        console.log("petitions-error:", error);
        reject(error);
      } else {
        const dataParsed = JSON.parse(body);
        if (logs) {
          console.log("petitions-resolve:", body);
        }
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
