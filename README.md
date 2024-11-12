# almantZod

This npm package has just been created. In the future, we plan to add more validation rules and features to enhance its functionality. Stay tuned for updates!

##

`almantZod` is a lightweight JavaScript validation library inspired by Zod, providing flexible validation rules for strings, integers, email, password and object schemas. Use `StringValidator`, `IntegerValidator`, `EmailValidator`, `PasswordValidator` and `ObjectSchema` to perform custom validations on your data, with easy-to-read error messages.

## Installation

To install this package, use npm:

```bash
npm install almant-validation
```
## API

## 1. StringValidator

Use `string()` to apply rules such as minimum/maximum length, regular expression matching, and email format checks to a string.
## Methods

- min(length, error): Validates that the string length is at least length characters.
- max(length, error): Validates that the string length is at most length characters.
- trim(): Removes leading and trailing whitespace from the string.
- validate(value): Runs all applied rules on the string and returns either the validated data if all rules pass or an error if any rule fails.

```javascript
import almantZod from 'alamnt-validation'

const stringValidator = almantZod.string()
  .min(5, { message: 'Too short!' })
  .max(10, { message: 'Too long!' })
  .trim();

const result = stringValidator.validate(" example@example.com ");
console.log(result); // { valid: true, data: "example@example.com" }
```

## 2. IntegerValidator

Use `integer()` to validate integer values based on minimum, maximum, and positive value constraints.
## Methods

- min(minValue, error): Ensures the integer is greater than or equal to minValue.
- max(maxValue, error): Ensures the integer is less than or equal to maxValue.
- positive(error): Ensures the integer is greater than 0.
- validate(value): Runs all applied rules on the integer and returns either the validated data if all rules pass or an error if any rule fails.

```javascript
import almantZod from 'alamnt-validation'

const integerValidator = almantZod.integer()
  .min(1, { message: 'Must be at least 1' })
  .positive({ message: 'Must be positive' });

const result = integerValidator.validate(10);
console.log(result); // { valid: true, data: 10 }
```

## 3. ObjectSchema

Use `object()` to validate complex objects based on a schema.
## Methods

- parseData(data): Validates the object against the schema and returns either an object data with success if all rules pass or an error if any rule fails.


```javascript
import almantZod from 'alamnt-validation'

const userSchema = almantZod.object({
  username: almantZod.string().min(3, { message: 'Username too short' }),
  email: almantZod.string().email({ message: 'Please enter a valid email.'}),
  password: almantZod.string().min(8, { message: 'Password must be at least 8 characters long.' })
 .regex(/[0-9]/, { message: 'Password must contain at least one number.' }),
  age: almantZod.integer().min(18, { message: 'Must be at least 18' }),
});

const result = userSchema.parseData({
  username: "john",
  email: "john@example.com",
  password: "password1",
  age: 20
});

console.log(result); 
// Expected output:
// { success: true, data: { username: "john", email: "john@example.com", password: "password1", age: 20 } }
```