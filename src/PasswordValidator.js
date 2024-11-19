class PasswordValidator {

  #rules;
  #allowNull;

  constructor() {
    this.#rules = [];
    this.#allowNull = false; // Flag to indicate if null values are allowed
  }

  /**
   * Allows null or empty values to pass validation.
   * @returns {PasswordValidator} - The instance with nullable behavior applied.
   */
  nullable() {
    this.#allowNull = true;
    return this;
  }

  /**
   * Validates the string using a regular expression.
   * @param {RegExp} pattern - Regular expression pattern to match the string.
   * @param {string} value - The value to validate.
   * @param {string} errorMessage - Error message for failed validation.
   * @returns {Object} - Validation result object.
   */
  #regex(pattern, value, errorMessage) {
    if (!pattern.test(value)) {
      return { valid: false, error: errorMessage };
    }
    return { valid: true, value };
  }

  /**
   * Adds a rule to ensure the password contains at least one number.
   * @returns {PasswordValidator} - The instance with the rule applied.
   */
  containsNumber() {
    const pattern = /[0-9]/;
    const message = 'Password must contain at least one number.';
    this.#rules.push((value) => this.#regex(pattern, value, message));
    return this;
  }

  /**
   * Adds a rule to ensure the password contains at least one special character.
   * @returns {PasswordValidator} - The instance with the rule applied.
   */
  containsSpecialChar() {
    const pattern = /[!@#$%^&*(),.?":{}|<>]/;
    const message = 'Password must contain at least one special character.';
    this.#rules.push((value) => this.#regex(pattern, value, message));
    return this;
  }

  /**
   * Adds a rule to ensure the password contains at least one uppercase letter.
   * @returns {PasswordValidator} - The instance with the rule applied.
   */
  containsUppercase() {
    const pattern = /[A-Z]/;
    const message = 'Password must contain at least one uppercase letter.';
    this.#rules.push((value) => this.#regex(pattern, value, message));
    return this;
  }

  /**
   * Adds a rule to ensure the password is at least `length` characters long.
   * @param {number} length - Minimum length required.
   * @returns {PasswordValidator} - The instance with the rule applied.
   */
  min(length) {
    this.#rules.push((value) => {
      if (value.length < length) {
        return { valid: false, error: `Password must be at least ${length} characters long.` };
      }
      return { valid: true };
    });
    return this;
  }

  /**
   * Validates the provided value against all #rules.
   * @param {string|null} value - The password to validate.
   * @returns {Object} - Validation result:
   *   - `valid` (`boolean`): True if all #rules pass.
   *   - `errors` (`string[]`): Array of error messages if validation fails.
   *   - `data` (`string|null`): The validated password, or null if invalid.
   */
  validate(value) {
    let errors = [];
    let validData = value;
    let isValid = true;

    if (value == null || value.length === 0) {
      if (this.#allowNull) {
        return { valid: true, data: null };
      }
      errors.push('Password is required');
      isValid = false;
      validData = null;
    } else if (typeof value !== 'string') {
      errors.push('Password must be a string');
      isValid = false;
      validData = null;
    } else {
      for (let rule of this.#rules) {
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
