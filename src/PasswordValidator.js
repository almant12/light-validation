class PasswordValidator {
  #rules;
  #allowNull;

  constructor() {
    this.#rules = [];
    this.#allowNull = false; // Flag to indicate if null values are allowed
  }

  /**
   * Internal method to validate a string using a regular expression.
   * @param {RegExp} pattern - Regular expression pattern.
   * @param {string} value - Value to validate.
   * @param {string} errorMessage - Error message for validation failure.
   * @returns {Object} - Validation result:
   *   - `valid` (boolean): True if the value matches the pattern, otherwise false.
   *   - `error` (string): Error message if validation fails.
   */
  #regex(pattern, value, errorMessage) {
    if (!pattern.test(value)) {
      return { valid: false, error: errorMessage };
    }
    return { valid: true, value };
  }

  /**
   * Allows null or empty values to pass validation.
   */
  nullable() {
    this.#allowNull = true;
    return this;
  }

  /**
   * Adds a rule to ensure the password contains at least one number.
   */
  containsNumber() {
    const pattern = /[0-9]/;
    const message = 'must contain at least one number.';
    this.#rules.push((value, fieldName) =>
      this.#regex(pattern, value, `${fieldName} ${message}`)
    );
    return this;
  }

  /**
   * Adds a rule to ensure the password contains at least one special character.
   */
  containsSpecialChar() {
    const pattern = /[!@#$%^&*(),.?":{}|<>]/;
    const message = 'must contain at least one special character.';
    this.#rules.push((value, fieldName) =>
      this.#regex(pattern, value, `${fieldName} ${message}`)
    );
    return this;
  }

  /**
   * Adds a rule to ensure the password contains at least one uppercase letter.
   */
  containsUppercase() {
    const pattern = /[A-Z]/;
    const message = 'must contain at least one uppercase letter.';
    this.#rules.push((value, fieldName) =>
      this.#regex(pattern, value, `${fieldName} ${message}`)
    );
    return this;
  }

  /**
   * Adds a rule to ensure the password is at least the specified length.
   * @param {number} length - Minimum length required for the password.
   */
  min(length) {
    const message = `must be at least ${length} characters long.`;
    this.#rules.push((value, fieldName) => {
      if (value.length < length) {
        return { valid: false, error: `${fieldName} ${message}` };
      }
      return { valid: true };
    });
    return this;
  }

  /**
   * Validates the provided string against all applied rules.
   * @param {string|null} value - The string to validate.
   * @param {Object} [options] - Optional parameters for validation.
   * @param {string} [options.fieldName='Password'] - Field name for error messages.
   * @returns {Object} - Validation result:
   *   - `valid` (boolean): True if all rules pass, otherwise false.
   *   - `errors` (string[]): List of error messages, if validation fails.
   *   - `data` (string|null): Validated string if valid, otherwise null.
   */
  validate(value, options = {}) {
    const { fieldName = 'Password' } = options;
    let errors = [];
    let validData = value;
    let isValid = true;

    if (value == null || value.length === 0) {
      if (this.#allowNull) {
        return { valid: true, data: null };
      }
      errors.push(`${fieldName} is required.`);
      isValid = false;
      validData = null;
    } else if (typeof value !== 'string') {
      errors.push(`${fieldName} must be a string.`);
      isValid = false;
      validData = null;
    } else {
      for (let rule of this.#rules) {
        const result = rule(value, fieldName);
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
