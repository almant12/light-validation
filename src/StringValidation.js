class StringValidator {

  #rules;
  #allowNull;

  constructor() {
    this.#rules = [];
    this.#allowNull = false; // Flag to indicate if null values are allowed
  }

  /**
   * Adds a rule to allow null or empty strings as valid inputs.
   * @returns {StringValidator} - The `StringValidator` instance with the `nullable` rule applied.
   */
  nullable() {
    this.#allowNull = true; // Enable nullable behavior
    return this; // Return the instance for chaining
  }

  /**
   * Adds a rule to ensure the string has at least `length` characters.
   * @param {number} length - The minimum number of characters required.
   * @param {Object} [options] - Optional parameters.
   * @param {string} [options.message] - Custom error message.
   * @returns {StringValidator} - The `StringValidator` instance with the `min` rule applied.
   */
  min(length, options = {}) {
    const message = `must be at least ${length} characters long.`;
    this.#rules.push((value,fieldName) => {
      if (value.length < length) {
        return { valid: false, error: options.message || `${fieldName} ${message}` };
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
   */
  max(length, options = {}) {
    const message = `must be no more than ${length} characters long.`;
    this.#rules.push((value,fieldName) => {
      if (value.length > length) {
        return { valid: false, error: options.message || `${fieldName} ${message}` };
      }
      return { valid: true, value };
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
    const {fieldName = 'value'} = options;
    let errors = [];
    let validData = value;
    let isValid = true;

    if (value == null || value.length === 0) {
      if (this.#allowNull) {
        return { valid: true, data: null }; // Pass validation for null/empty if nullable
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
        const result = rule(value.trim(),fieldName);
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

module.exports = StringValidator;
