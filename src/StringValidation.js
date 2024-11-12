/**
 * Class for validating strings with customizable rules for minimum and maximum length.
 * Includes error handling with default or custom messages.
 */
class StringValidator {
  constructor() {
    this.rules = [];
  }

  /**
   * Adds a rule to ensure the string has at least `length` characters.
   * @param {number} length - The minimum number of characters required.
   * @param {Object} [options] - Optional parameters.
   * @param {string} [options.message] - Custom error message.
   * @returns {StringValidator} - The `StringValidator` instance with the `min` rule applied.
   *
   */
  min(length, options = {}) {
    const message = `Value must be at least ${length} characters long.`;
    this.rules.push((value) => {
      if (value.length < length) {
        return { valid: false, error: options.message || message }; 
      }
      return { valid: true, value };
    });
    return this;
  }

  /**
   * Adds a rule to ensure the string has no more than `length` characters.
   * @param {number} length - The maximum number of characters allowed.
   * @param {Object} [options] - Optional parameters.
   * @param {string} [options.message] - Custom error message.
   * @returns {StringValidator} - The `StringValidator` instance with the `max` rule applied.
   *
   */
  max(length, options = {}) {
    const message = `Value must be no more than ${length} characters long.`;
    this.rules.push((value) => {
      if (value.length > length) {
        return { valid: false, error: options.message || message }; 
      }
      return { valid: true, value };
    });
    return this;
  }

  /**
   * Validates the provided string against all applied rules.
   * Checks if the string satisfies each rule in `rules`, collecting errors if any.
   * @param {string} value - The string to validate.
   * @returns {Object} - Validation result:
   *   - `valid` (`boolean`): True if all rules pass, otherwise false.
   *   - `errors` (`string[]`): An array of error messages, if validation fails.
   *   - `data` (`string|null`): The validated string if valid, otherwise null.
   *
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
        const result = rule(value.trim());

        if (!result.valid) {
          errors.push(result.error);
          isValid = false;
          validData = null;
        } else {
          validData = result.value;
        }
      }
    }

    return isValid ? { valid: true, data: validData } : { valid: false, errors };
  }
}

module.exports = StringValidator;  // Ensure you export the class
