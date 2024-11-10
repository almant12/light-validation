class StringValidator {
  constructor() {
    this.rules = [];
  }

  /**
   * Ensures the string length is at least `length` characters.
   * @param {number} length - Minimum length of the string.
   * @param {Object} error - Custom error message.
   * @returns {StringValidator} - The `StringValidator` instance with the `min` rule applied.
   */
  min(length, error) {
    this.rules.push((value) => {
      if (typeof value !== 'string' || value.length < length) {
        return { valid: false, error: error.message }; 
      }
      return { valid: true, value };
    });
    return this;
  }

  /**
   * Ensures the string length is at most `length` characters.
   * @param {number} length - Maximum length of the string.
   * @param {Object} error - Custom error message.
   * @returns {StringValidator} - The `StringValidator` instance with the `max` rule applied.
   */
  max(length, error) {
    this.rules.push((value) => {
      if (typeof value !== 'string' || value.length > length) {
        return { valid: false, error: error.message }; 
      }
      return { valid: true, value };
    });
    return this;
  }

  /**
   * Validates the string using a regular expression.
   * @param {RegExp} pattern - Regular expression pattern to match the string.
   * @param {Object} error - Custom error message.
   * @returns {StringValidator} - The `StringValidator` instance with the `regex` rule applied.
   */
  regex(pattern, error) {
    this.rules.push((value) => {
      if (typeof value === 'string' && !pattern.test(value)) {
        return { valid: false, error: error.message };
      }
      return { valid: true, value };
    });
    return this;
  }

  /**
   * Validates the string as an email format using a regular expression.
   * @param {Object} error - Custom error message.
   * @returns {StringValidator} - The `StringValidator` instance with the `email` rule applied (internally calls `regex`).
   */
  email(error) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return this.regex(emailPattern, error); 
  }

  /**
   * Removes leading and trailing spaces from the string.
   * @returns {StringValidator} - The `StringValidator` instance with the `trim` rule applied.
   */
  trim() {
    this.rules.push((value) => {
      if (typeof value === 'string') {
        return { valid: true, value: value.trim() };
      }
      return { valid: false, error: 'Value must be a string.' };
    });
    return this;
  }

  /**
   * Validates the provided string value against all applied rules.
   * @param {string} value - The string to validate.
   * @returns {Object} - An object containing:
   * - `valid`: `true` if validation passed, `false` if any rule failed.
   * - `errors`: Array of error messages.
   * - `data`: The validated data or `null` if validation failed.
   */
  validate(value) {
    let errors = [];
    let validData = value;
    let isValid = true;

    if (typeof value !== 'string') {
      errors.push('Value must be a string.');
      isValid = false;
      validData = null;
    } else {
      for (let rule of this.rules) {
        const result = rule(value);

        if (!result.valid) {
          errors.push(result.error);
          isValid = false;
          validData = null;
        } else {
          validData = result.value;
        }
      }
    }

    return isValid ? {valid: true, data:validData} : {valid: false, errors}
  }
}


module.exports = StringValidator;  // Ensure you export the class