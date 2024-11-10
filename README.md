# almantZod

`almantZod` is a lightweight JavaScript validation library inspired by Zod, providing flexible validation rules for strings, integers, and object schemas. Use `StringValidator`, `IntegerValidator`, and `ObjectSchema` to perform custom validations on your data, with easy-to-read error messages.

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
- regex(pattern, error): Validates that the string matches a given regular expression.
- email(error): Validates that the string is in email format.
- trim(): Removes leading and trailing whitespace from the string.
- validate(value): Runs all applied rules on the string and returns either the validated data if all rules pass or an error if any rule fails.

```javascript
import almantZod from 'alamnt-validation'

const stringValidator = almantZod.string()
  .min(5, { message: 'Too short!' })
  .max(10, { message: 'Too long!' })
  .email({ message: 'Invalid email format' })
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
