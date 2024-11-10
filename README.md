# almantZod

`almantZod` is a lightweight JavaScript validation library inspired by Zod, providing flexible validation rules for strings, integers, and object schemas. Use `StringValidator`, `IntegerValidator`, and `ObjectSchema` to perform custom validations on your data, with easy-to-read error messages.

## Installation

To install this package, use npm:

```bash
npm install almant-validation
```
## API

## 1. StringValidator

Use StringValidator to apply rules such as minimum/maximum length, regular expression matching, and email format checks to a string.
## Methods

- min(length, error): Validates that the string length is at least length characters.
- max(length, error): Validates that the string length is at most length characters.
- regex(pattern, error): Validates that the string matches a given regular expression.
- email(error): Validates that the string is in email format.
- trim(): Removes leading and trailing whitespace from the string.
- validate(value): Runs all applied rules on the string and returns either the validated data if all rules pass or an error if any rule fails.

```javascript
const { StringValidator } = require('almantZod');

const validator = new StringValidator()
  .min(5, 'String must be at least 5 characters long')
  .max(50, 'String cannot exceed 50 characters')
  .regex(/^[a-zA-Z0-9]*$/, 'String must only contain alphanumeric characters')
  .email('Invalid email format')
  .trim();

const result = validator.validate(' test@example.com ');

console.log(result);
// Output:
// {
//   data: 'test@example.com',
//   error: null
// }