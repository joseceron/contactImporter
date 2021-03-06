const {
  containsSpecialChars,
  isValidDate,
  isValidPhone
} = require("../utils/validators");

const cards = require("../utils/cards")

const {
  encryptCreditCardNumber,
  decryptCreditCardNumber,
  showLastFourDigits
} = require("../utils/encrypt");

test('Are valid names?', () => {

  let names = [
    'jose luis',
    'Luisa-campo',
    ' Fernando 123',
  ]

  names.forEach(name => {
    let contains = containsSpecialChars(name)
    expect(contains).toBe(false)
  });
})


test('The names contains special chars', () => {
  let names = [
    'jose luis!',
    'Luisa-campo*',
    '? Fernando 123',
    ', Fernando 123',
    '@ Fernando 123.com',
    '123.com]',
  ]
  names.forEach(name => {
    let contains = containsSpecialChars(name)
    expect(contains).toBe(true)   
  });
})

test('Validate correct dates formats', () => {
  let dates = [
    '2021-12-01',
    '19820128',    
  ]
  dates.forEach(date => {
    let isValid = isValidDate(date)
    expect(isValid).toBe(true)
  })
})

test('Validator for bad format dates', () => {
  let dates = [
    '2021-15-01',
    '1980128',    
    '1800-01-281', 
    ''   
  ]
  dates.forEach(date => {
    let isValid = isValidDate(date)
    expect(isValid).toBe(false)
  })
})

test('Phone logic validation', () => {
  let phones = [
    '(+57) 320 562 76 12',
    '(+57) 320-562-76-12',
    '(+5) 301-562-76-12',
    '(+1) 311 562 76 12',
  ]
  phones.forEach(phone => {
    let isValid = isValidPhone(phone)
    expect(isValid).toBe(true)
  })
})

test('Phone logic validation for bad formats', () => {
  let phones = [
    '(+57 320 562 76 12',
    '(57) 320-562-76-12',
    '(57) 32-562-76-12',
    '(+5)-301-562-76-12',
    '(+1) 311 562 761 12',
    '+1) 311 562 761 12',
    '+1 311 562 761 12',
    '+1 311 562 761 123',
    '(+1) 311 562 76',
    '(+1) 311 562 763 12',
    '(+1) 311 562 763 122',
    '(+1)',
  ]
  phones.forEach(phone => {
    let isValid = isValidPhone(phone)
    expect(isValid).toBe(false)
  })
})

test('Encrypt credit card numbers', () => {
  cards.map(card => {
    let encrypted = encryptCreditCardNumber(card.number)
    let decrypted = decryptCreditCardNumber(encrypted)
    expect(decrypted).toBe(card.number)
  })
})