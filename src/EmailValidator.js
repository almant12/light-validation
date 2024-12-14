/**
 * Class for validating email addresses with customizable rules.
 * Supports basic email format validation and optional maximum length restriction.
 */
class EmailValidator {

  #rules; // Private attribute for storing validation rules
  #allowNull; // Private attribute for nullable email option
  #message; // Private attribute for the default message

  constructor(options = {}) {
    const errorMessage = 'Email must be valid';
    this.#message = options.message || errorMessage;
    this.#rules = []; // Array to store validation rules
    this.#allowNull = false; // Default is not allowing null emails
  }

  /**
   * Allows the email to be nullable (can be null or empty).
   */
  nullable() {
    this.#allowNull = true;
    return this; // Enable chaining
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
      return { valid: false, error: errorMessage };
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
   */
  max(length, options = {}) {
    const message = `must be no more than ${length} characters long.`;
    this.#rules.push((value,fieldName) => {
      if (value.length > length) {
        return { valid: false, error: options.message || `${fieldName} ${message}` };
      }
      return { valid: true, data: value };
    });
    return this; // Enable chaining
  }

   /**
 * Validates the provided string against all applied #rules.
 * Checks if the string satisfies each rule in `#rules`, collecting errors if any.
 * 
 * @param {string|null} value - The string to validate.
 * @param {Object} [options] - Optional parameters for the validation.
 * @param {string} [options.fieldName='value'] - The name of the field being validated. 
 *                                            Defaults to 'value' if not provided. 
 *                                            It helps to customize error messages for specific fields.
 * @returns {Object} - Validation result:
 *   - `valid` (`boolean`): True if all #rules pass, otherwise false.
 *   - `errors` (`string[]`): An array of error messages, if validation fails.
 *   - `data` (`string|null`): The validated string if valid, otherwise null.
   */
  validate(value,options = {}) {
    const {fieldName = 'Email'} = options;
    let errors = [];
    let validData = value;
    let isValid = true;

    // Check for null or empty value if nullable is allowed
    if (value == null || value.length === 0) {
      if (this.#allowNull) {
        return { valid: true, data: null }; // Return null if email is allowed to be null
      }
      errors.push(`${fieldName} is required`);
      isValid = false;
      validData = null;
    } else {
      // Ensure the value is a string (assuming it's a basic string input)
      if (typeof value !== 'string') {
        errors.push(`${fieldName} must be a string`);
        isValid = false;
        validData = null;
      } else {
        // Apply email format validation
        const emailValidation = this.#email(value, this.#message);
        if (!emailValidation.valid) {
          errors.push(emailValidation.error);
          isValid = false;
          validData = null;
        } else {
          validData = emailValidation.data;
        }

        // Apply additional rules from the `#rules` array
        for (let rule of this.#rules) {
          const result = rule(value,fieldName);
          if (!result.valid) {
            errors.push(result.error);
            isValid = false;
            validData = null; // Reset validData if invalid
          } else {
            validData = result.data; // Update validData if valid
          }
        }
      }
    }

    return isValid ? { valid: true, data: validData } : { valid: false, errors };
  }
}

module.exports = EmailValidator;
