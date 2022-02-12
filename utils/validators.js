const moment = require('moment')

const containsSpecialChars = str => {
  const specialChars = /[`!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~]/;
  return specialChars.test(str);
};

const isValidDate = (date) => {
  let validation1 = moment(date, 'YYYY-MM-DD',true).isValid()
  let validation2 = moment(date, 'YYYYMMDD',true).isValid()

  if(validation1 || validation2) return true
  else return false
  
}

const isValidPhone = (phoneNumber) => {
  var found = phoneNumber.search(/^([(](\+{1}){1}\d{1,2}[)]{1})(\s?\d{3}[\s|-]?\d{3}[\s|-]?\d{2}[\s|-]?\d{2})$/);
  
  if(found > -1) {
    return true;
  }
  else {
    return false;
  }

}

module.exports = {
  containsSpecialChars,
  isValidDate,
  isValidPhone,
};
