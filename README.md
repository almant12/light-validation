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
- validate(value): Runs all applied rules on the string and returns an object containing valid, errors, and data.