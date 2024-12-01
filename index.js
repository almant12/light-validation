const StringValidator = require('./src/StringValidation')
const IntegerValidator = require('./src/IntegerValidator')
const ObjectSchema = require('./src/ObjectSchema');
const EmailValidator = require('./src/emailValidator');
const PasswordValidator = require('./src/PasswordValidator')
const FileValidator = require('./src/FileValidator')

/**
 * v is a lightweight validation library that provides various input validation methods.
 */
const v = {
  file: () => new FileValidator(),
  email: (options) => new EmailValidator(options),
  password: () => new PasswordValidator(),
  string: () => new StringValidator(),
  integer: () => new IntegerValidator(),
  object: (schema) => new ObjectSchema(schema)
};

module.exports = v;
