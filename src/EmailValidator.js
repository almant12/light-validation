/**
 * Class for validating email addresses with customizable rules.
 * Supports basic email format validation and optional maximum length restriction.
 */
class EmailValidator {

    constructor() {
      this.rules = []; // Array to store validation rules
    }
  
    /**
     * Private method to validate a string using a regular expression.
     * @param {RegExp} pattern - The regular expression pattern to match against.
     * @param {string} value - The string to test with the regex.
     * @param {string} errorMessage - The error message to return if the pattern fails.
     * @returns {Object} - An object with `valid` and `error` properties if invalid, or `data` if valid.
     */
    #regex(pattern, value, errorMessage) {
      if (!pattern.test(value)) {
        return { valid: false, error: errorMessage || 'Invalid email format.' };
      }
      return { valid: true, data: value };
    }
  
    /**
     * Private method to validate the email format.
     * Uses a basic email regex pattern.
     * @param {string} value - The email string to validate.
     * @param {string} errorMessage - Custom error message if validation fails.
     * @returns {Object} - Result of the regex validation.
     */
    #email(value, errorMessage) {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return this.#regex(emailPattern, value, errorMessage);
    }
  
    /**
     * Adds a maximum length validation rule to the email validator.
     * @param {number} length - Maximum allowed length of the email.
     * @param {Object} [options] - Optional parameters.
     * @param {string} [options.message] - Custom error message.
     * @returns {EmailValidator} - The `EmailValidator` instance with the `max` rule applied.
     */
    max(length, options = {}) {
      const message = `Email must be no more than ${length} characters long.`;
      this.rules.push((value) => {
        if (value.length > length) {
          return { valid: false, error: options.message || message };
        }
        return { valid: true, data: value };
      });
      return this; // Enable chaining
    }
  
    /**
     * Validates the provided email string against all applied rules.
     * Checks each rule in the rules array, including format and length validation.
     * @param {string} value - The email string to validate.
     * @returns {Object} - Validation result:
     *   - `valid` (`boolean`): True if all rules pass, otherwise false.
     *   - `errors` (`string[]`): An array of error messages if validation fails.
     *   - `data` (`string|null`): The validated email if valid, otherwise null.
     *
     */
    validate(value) {
      let errors = [];
      let validData = value;
      let isValid = true;
  
      // Ensure the value is a string
      if (typeof value !== 'string') {
        errors.push('Value must be a string.');
        isValid = false;
        validData = null;
      } else {
        // Apply email format validation
        const emailValidation = this.#email(value);
        if (!emailValidation.valid) {
          errors.push(emailValidation.error);
          isValid = false;
          validData = null;
        } else {
          validData = emailValidation.data;
        }
  
        // Apply additional rules from the `rules` array
        for (let rule of this.rules) {
          const result = rule(value);
          if (!result.valid) {
            errors.push(result.error);
            isValid = false;
            validData = null; // Reset validData if invalid
          } else {
            validData = result.data; // Update validData if valid
          }
        }
      }
  
      return isValid ? { valid: true, data: validData } : { valid: false, errors };
    }
  }
  
  module.exports = EmailValidator;
  