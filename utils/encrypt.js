require('dotenv').config();
const aes256 = require('aes256');
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY

const encryptCreditCardNumber = (creditCardNumber) => {
  let encryptedBankAccountNumber = aes256.encrypt(ENCRYPTION_KEY, creditCardNumber);
  return encryptedBankAccountNumber;
};

const decryptCreditCardNumber = (creditCardNumber) => {
  let decryptedBankAccountNumber = aes256.decrypt(ENCRYPTION_KEY, creditCardNumber);
  return decryptedBankAccountNumber;
}

const showLastFourDigits = (creditCardNumberStr) => {
  return creditCardNumberStr.replace(/.(?=.{4})/g, 'x')
}

module.exports = {
  encryptCreditCardNumber,
  decryptCreditCardNumber,
  showLastFourDigits
};
