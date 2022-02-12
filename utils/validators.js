const moment = require('moment')

const containsSpecialChars = str => {
  const specialChars = /[`!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~]/;
  return specialChars.test(str);
};

const isValidDate2 = dateString => {
  // First check for the pattern
  if (!/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(dateString)) return false;
  // Parse the date parts to integers
  var parts = dateString.split("-");
  var year = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10);
  var day = parseInt(parts[2], 10);


  // Check the ranges of month and year
  if (year < 1000 || year > 3000 || month == 0 || month > 12) return false;

  var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Adjust for leap years
  if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
    monthLength[1] = 29;

  // Check the range of the day
  return day > 0 && day <= monthLength[month - 1];
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
