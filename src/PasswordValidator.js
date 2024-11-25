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
      return { valid: false, error: errorMessage};
    }
    return { valid: true, value };
  }

  /**
   * Adds a rule to ensure the password contains at least one number.
   * @returns {PasswordValidator} - The instance with the rule applied.
   */
  containsNumber() {
    const pattern = /[0-9]/;
    const message = 'must contain at least one number.';
    this.#rules.push((value,fieldName) => this.#regex(pattern, value, `${fieldName} ${message}`));
    return this;
  }

  /**
   * Adds a rule to ensure the password contains at least one special character.
   * @returns {PasswordValidator} - The instance with the rule applied.
   */
  containsSpecialChar() {
    const pattern = /[!@#$%^&*(),.?":{}|<>]/;
    const message = 'must contain at least one special character.';
    this.#rules.push((value, fieldName) => this.#regex(pattern, value, `${fieldName} ${message}`));
    return this;
  }

  /**
   * Adds a rule to ensure the password contains at least one uppercase letter.
   * @returns {PasswordValidator} - The instance with the rule applied.
   */
  containsUppercase() {
    const pattern = /[A-Z]/;
    const message = 'must contain at least one uppercase letter.';
    this.#rules.push((value,fieldName) => this.#regex(pattern, value, `${fieldName} ${message}`));
    return this;
  }

  /**
   * Adds a rule to ensure the password is at least `length` characters long.
   * @param {number} length - Minimum length required.
   * @returns {PasswordValidator} - The instance with the rule applied.
   */
  min(length) {
    const message = `must be at least ${length} characters long`
    this.#rules.push((value,fieldName) => {
      if (value.length < length) {
        return { valid: false, error: `${fieldName} ${message}` };
      }
      return { valid: true };
    });
    return this;
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
    const {fieldName = 'Password'} = options;
    let errors = [];
    let validData = value;
    let isValid = true;

    if (value == null || value.length === 0) {
      if (this.#allowNull) {
        return { valid: true, data: null };
      }
      errors.push(`${fieldName} is required`);
      isValid = false;
      validData = null;
    } else if (typeof value !== 'string') {
      errors.push(`${fieldName} must be a string`);
      isValid = false;
      validData = null;
    } else {
      for (let rule of this.#rules) {
        const result = rule(value,fieldName);
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
