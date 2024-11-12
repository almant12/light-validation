/**
 * Class for validating passwords with customizable rules.
 * Includes options for checking minimum length, presence of numbers, and special characters.
 */
class PasswordValidator {
  constructor() {
    this.rules = [];
  }

  /**
   * Private method to validate a string using a regular expression.
   * @param {RegExp} pattern - The regular expression pattern to match against.
   * @param {string} value - The string to test with the regex.
   * @param {string} errorMessage - The error message to return if the pattern fails.
   * @returns {Object} - An object with `valid` and `error` properties.
   */
  #regex(pattern, value, errorMessage) {
    if (!pattern.test(value)) {
      return { valid: false, error: errorMessage };
    }
    return { valid: true, value };
  }

  /**
   * Adds a rule to ensure the password contains at least one numeric character.
   * @returns {PasswordValidator} - The `PasswordValidator` instance with the `containsNumber` rule applied.
   */
  containsNumber() {
    const pattern = /[0-9]/;
    const message = 'Password must contain at least one number.';
    this.rules.push((value) => this.#regex(pattern, value, message));
    return this;
  }

  /**
   * Adds a rule to ensure the password contains at least one special character.
   * @returns {PasswordValidator} - The `PasswordValidator` instance with the `containsSpecialChar` rule applied.
   */
  containsSpecialChar() {
    const pattern = /[!@#$%^&*(),.?":{}|<>]/;
    const message = 'Password must contain at least one special character.';
    this.rules.push((value) => this.#regex(pattern, value, message));
    return this;
  }

  /**
   * Adds a rule to ensure the password has a minimum length.
   * @param {number} length - The minimum length for the password.
   * @param {Object} [options] - Optional parameters.
   * @param {string} [options.message] - Custom error message.
   * @returns {PasswordValidator} - The `PasswordValidator` instance with the `min` rule applied.
   */
  min(length, options = {}) {
    const message = `Password must be at least ${length} characters long.`;
    this.rules.push((value) => {
      if (value.length < length) {
        return { valid: false, error: options.message || message };
      }
      return { valid: true, value };
    });
    return this;
  }

  /**
   * Validates the provided password string against all applied rules.
   * Checks each rule in `rules`, collecting errors if any.
   * @param {string} value - The password string to validate.
   * @returns {Object} - Validation result:
   *   - `valid` (`boolean`): True if all rules pass, otherwise false.
   *   - `errors` (`string[]`): An array of error messages, if validation fails.
   *   - `data` (`string|null`): The validated password if valid, otherwise null.
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

    return isValid ? { valid: true, data: validData } : { valid: false, errors };
  }
}

module.exports = PasswordValidator;
