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

     // Private method for parsing strings as booleans
  #parseBoolean(value) {
    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase();
      if (lowerValue === 'true' || lowerValue === '1') {
        return true;
      } else if (lowerValue === 'false' || lowerValue === '0') {
        return false;
      }
    }
    return value; // Return the original value if not a parsable string
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
      let isValid = true;

      // Parse value to boolean if it's a string
      value = this.#parseBoolean(value);
  
      if (value === null) {
        if (this.#allowNull) {
          return { valid: true, data: null }; // Pass validation for null if nullable
        }
        errors.push(`${fieldName} is required`);
        isValid = false;
      } else if (typeof value !== 'boolean') {
        errors.push(`${fieldName} must be a boolean`);
        isValid = false;
      }
  
      return isValid ? { valid: true, data: value } : { valid: false, errors };
    }
  }
  
  module.exports = BooleanValidator;
  