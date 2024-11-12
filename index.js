const StringValidator = require('./src/StringValidation')
const IntegerValidator = require('./src/IntegerValidator')
const ObjectSchema = require('./src/ObjectSchema');
const EmailValidator = require('./src/emailValidator');
const PasswordValidator = require('./src/PasswordValidator')

const almantZod = {
  email: () => new EmailValidator(),
  password: () => new PasswordValidator(),
  string: () => new StringValidator(),
  integer: () => new IntegerValidator(),
  object: (schema) => new ObjectSchema(schema)
};

module.exports = almantZod;
