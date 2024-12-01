# Light Validation

This npm package has just been created. In the future, we plan to add more validation rules and features to enhance its functionality. Stay tuned for updates!

##

`Light Validation` is a lightweight JavaScript validation library inspired by Zod, providing flexible validation rules for strings, integers, email, password and object schemas. Use `string()`, `integer()`, `email()`, `file()`, `password()` and `object()` to perform custom validations on your data, with easy-to-read error messages.

## Installation

To install this package, use npm:

```bash
npm install light-validation
```
## API

## 1. StringValidator

Use `string()` to apply rules such as minimum/maximum length. Errors are optional, so if you don't want an error message, you can skip providing one.
### Rules:

- min(length, options): Validates that the string length is at least length characters.
- max(length, options): Validates that the string length is at most length characters.
- nullable(): Allows the string to be null or an empty string, making it a valid input when set.
- validate(value, options): Runs all applied rules on the string and returns either the validated data if all rules pass, or an error if any rule fails. If you are not using a schema, you can pass the `fieldName` as an option to attach the fieldName to error message.

```javascript
import v from 'light-validation';

const result = v.validate.min(7)
.("Almant",{fieldName:'Name'});

console.log(result); //  {valid: false, errors: [ 'Name must be at least 5 characters long.' ]}

```

## 2. IntegerValidator

Use `integer()` to validate integer values based on minimum, maximum, and positive value constraints.
### Rules:

- min(minValue, options): Ensures the integer is greater than or equal to minValue.
- max(maxValue, options): Ensures the integer is less than or equal to maxValue.
- nullable(): Allows the string to be null or an empty string, making it a valid input when set.
- positive(error): Ensures the integer is greater than 0.
- validate(value, options): Runs all applied rules on the integer and returns either the validated data if all rules pass, or an error if any rule fails. If you are not using a schema, you can pass the `fieldName` as an option to attach the fieldName to error message.

```javascript
import v from 'light-validation';

const result = v.integer().min(18)
.validate(17,{fieldName:'Age'})

console.log(result); // { valid: false, errors: [ 'Age must be greater than or equal to 18' ] }

//Or you can define your custom error message

const result1 = v.integer().min(18,{message:'You must be at least 18 years old'})
.validate(17,{fieldName:'Age'})

console.log(result1); // { valid: false, errors: [ 'You must be at least 18 years old' ] }
```

## 3. EmailValidator

Use `email()` to validate email addresses with built-in checks for proper email format.
### Rules:

- nullable(): Allows the string to be null or an empty string, making it a valid input when set.
- validate(value, options): Runs all applied rules on the integer and returns either the validated data if all rules pass, or an error if any rule fails. If you are not using a schema, you can pass the `fieldName` as an option to attach the fieldName to error message.

```javascript
import v from 'light-validation';

const result = v.email().validate('almant@gmail.com')

console.log(result); // { valid: true, data: 'almant@gmail.com' }
```

## 4. PasswordValidation

Use `password()` to validate passwords with requirements like minimum length, inclusion of numbers, symbols, etc.
### Rules:

- containsNumber(): Ensures the password contains at least one numeric digit.
- containsSpecialChar(): Ensures the password contains at least one special character.
- containsUppercase(): Ensures the password contains at least one uppercase letter.
- min(): Ensures the password has a minimum length.
- nullable(): Allows the string to be null or an empty string, making it a valid input when set.
- validate(value, options): Runs all applied rules on the integer and returns either the validated data if all rules pass, or an error if any rule fails. If you are not using a schema, you can pass the `fieldName` as an option to attach the fieldName to error message.

```javascript
import v from 'light-validation';

const password = v.password().min(8)
.containsNumber()
.containsSpecialChar()
.validate('1234567',{fieldName:"Password"});

console.log(result);  //{
//   valid: false,
//   errors: [
//     'Password must be at least 8 characters long.',
//     'Password must contain at least one special character.'
//   ]
// }
```

## 5. FileValidation

Use `file()` to validate file uploads based on type, size, and other properties.
### Rules:

- type(mimeType, error): Ensures the file is of the specified MIME type (e.g., 'image/jpeg').
- size(maxSize, error): Ensures the file is not larger than maxSize.
- nullable(): Allows the string to be null or an empty string, making it a valid input when set.
- validate(value, options): Runs all applied rules on the integer and returns either the validated data if all rules pass, or an error if any rule fails. If you are not using a schema, you can pass the `fieldName` as an option to attach the fieldName to error message.

```javascript
import v from 'light-validation';

const file = {
  type: 'image/jpg',
  size: 50000000, // 5MB
};

// Validate the file with specific rules: type must be 'image/jpg' and size must not exceed 5MB.
const image = v
  .file()  // Start the validation chain for file
  .type(['jpg'])  // Validate that the file is of type 'jpg'
  .maxSize(5)  // Validate that the file pass it as MB
  .validate(file, { fieldName: 'avatar' });  // Perform validation on the 'file' object with custom field name 'avatar'

console.log(image); 
// This will log the result of the validation. If everything is fine, it will return:
// { valid: true, data: file }
// Otherwise, it will return errors based on the validation rules.
```

## 6. ObjectSchema

Use `object()` to validate objects against a predefined schema. Each field in the schema is associated with a validator that provides specific validation rules and methods.

- parseData(data): Validates the object against the schema and returns either an object data with success if all rules pass or an error if any rule fails.


```javascript
import v from 'light-validation';

 const userSchema = v.object({
    username: v.string().min(3),
    email: v.email(),
    password: v.password().min(8).containsSpecialChar(),
    age: v.integer().min(18),
  });
  
  const result = userSchema.parseData({
    username: "john",
    email: "john@example.com",
    password: "password1",
    age: 20
  });

console.log(result); 
// Expected output:
/*
{
  valid: false,
  errors: { password: 'password must contain at least one special character.' }
}
*/
```