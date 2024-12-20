class BooleanValidator {
    #rules;
    #allowNull;
  
    constructor() {
      this.#rules = [];
      this.#allowNull = false; // Flag to indicate if null values are allowed
    }
  
    /**
     * Adds a rule to allow null values as valid inputs.
     */
    nullable() {
      this.#allowNull = true; // Enable nullable behavior
      return this; // Return the instance for chaining
    }
  
    /**
     * Validates the provided boolean value against all applied rules.
     * 
     * @param {boolean|null} value - The boolean value to validate.
     * @param {Object} [options] - Optional parameters for the validation.
     * @param {string} [options.fieldName='value'] - The name of the field being validated. 
     * @returns {Object} - Validation result:
     *   - `valid` (`boolean`): True if all rules pass, otherwise false.
     *   - `errors` (`string[]`): An array of error messages, if validation fails.
     *   - `data` (`boolean|null`): The validated boolean if valid, otherwise null.
     */
    validate(value, options = {}) {
      const { fieldName = 'value' } = options;
      let errors = [];
      let validData = value;
      let isValid = true;
  
      if (value === null) {
        if (this.#allowNull) {
          return { valid: true, data: null }; // Pass validation for null if nullable
        }
        errors.push(`${fieldName} is required`);
        isValid = false;
        validData = null;
      } else if (typeof value !== 'boolean') {
        errors.push(`${fieldName} must be a boolean`);
        isValid = false;
        validData = null;
      }
  
      return isValid ? { valid: true, data: validData } : { valid: false, errors };
    }
  }
  
  module.exports = BooleanValidator;
  