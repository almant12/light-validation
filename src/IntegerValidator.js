class IntegerValidator {
  #rules;
  #allowNull;

  constructor() {
    this.#rules = [];
    this.#allowNull = false; // Default is to not allow null
  }

  /**
   * Allows the integer value to be `null`.
   * @returns {IntegerValidator} - The `IntegerValidator` instance with the nullable flag enabled.
   */
  nullable() {
    this.#allowNull = true;
    return this;
  }

  /**
   * Ensures the integer value is greater than or equal to `minValue`.
   * @param {number} minValue - Minimum value the integer should be.
   * @param {Object} [options] - Optional parameters.
   * @param {string} [options.message] - Custom error message.
   */
  min(minValue, options = {}) {
    const message = `must be greater than or equal to ${minValue}`;
    this.#rules.push((value,fieldName) => {
      if (value < minValue) {
        return { valid: false, error: options.message || `${fieldName} ${message}`};
      }
      return { valid: true, value };
    });
    return this;
  }

  /**
   * Ensures the integer value is less than or equal to `maxValue`.
   * @param {number} maxValue - Maximum value the integer should be.
   * @param {Object} [options] - Optional parameters.
   * @param {string} [options.message] - Custom error message.
   */
  max(maxValue, options = {}) {
    const message = `must be less than or equal to ${maxValue}`;
    this.#rules.push((value,fieldName) => {
      if (value > maxValue) {
        return { valid: false, error: options.message || `${fieldName} ${message}`};
      }
      return { valid: true, value };
    });
    return this;
  }

  /**
   * Ensures the integer value is positive (greater than 0).
   * @param {Object} [options] - Optional parameters.
   */
  positive(options = {}) {
    const message = 'must be a positive number';
    this.#rules.push((value,fieldName) => {
      if (value <= 0) {
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
   validate(value, options = {}) {
    const { fieldName = 'value' } = options;
    let errors = [];
    let validData = value;
    let isValid = true;

    // Check if value is null or empty
    if (value == null || value.length === 0) {
      if (this.#allowNull) {
        return { valid: true, data: null }; // Pass validation for null/empty if nullable
      }
      errors.push(`${fieldName} is required`);
      isValid = false;
      validData = null;
    } else {
      // Convert string to number if needed, while still checking for other errors
      if (typeof value === 'string') {
        value = parseInt(value, 10); // Try converting string to integer
      }

      // Validate if value is a number and an integer
      if (typeof value !== 'number' || !Number.isInteger(value)) {
        errors.push(`${fieldName} must be an integer`);
        isValid = false;
        validData = null;
      } else {
        // Additional rules
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
    }

    return isValid ? { valid: true, data: validData } : { valid: false, errors };
}

  
}

module.exports = IntegerValidator; // Ensure you export the class
