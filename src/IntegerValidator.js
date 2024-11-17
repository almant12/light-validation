class IntegerValidator {
  constructor() {
    this.rules = [];
  }

  /**
   * Ensures the integer value is greater than or equal to `minValue`.
   * @param {number} minValue - Minimum value the integer should be.
   * @param {Object} error - Custom error message.
   * @returns {IntegerValidator} - The `IntegerValidator` instance with the `min` rule applied.
   */
  min(minValue, options = {}) {
    const message = `Value must be greater than or equal to ${minValue}`
    this.rules.push((value) => {
      if (value < minValue) {
        return { valid: false, error: options.message || message};
      }
      return { valid: true, value };
    });
    return this;
  }

  /**
   * Ensures the integer value is less than or equal to `maxValue`.
   * @param {number} maxValue - Maximum value the integer should be.
   * @param {Object} error - Custom error message.
   * @returns {IntegerValidator} - The `IntegerValidator` instance with the `max` rule applied.
   */
  max(maxValue, options = {}) {
    const message = `Value must be less than or equal to ${maxValue}`
    this.rules.push((value) => {
      if (value > maxValue) {
        return { valid: false, error: options.message || message };
      }
      return { valid: true, value };
    });
    return this;
  }

  /**
   * Ensures the integer value is positive (greater than 0).
   * @param {Object} error - Custom error message.
   * @returns {IntegerValidator} - The `IntegerValidator` instance with the `positive` rule applied.
   */
  positive(options = {}) {
    const message = 'Value must be a positive number';
    this.rules.push((value) => {
      if (value <= 0) {
        return { valid: false, error: options.message || message };
      }
      return { valid: true, value };
    });
    return this;
  }

  /**
   * Validates the provided integer value against all applied rules.
   * @param {number} value - The integer to validate.
   * @returns {Object} - An object containing:
   * - `valid`: `true` if validation passed, `false` if any rule failed.
   * - `errors`: Array of error messages.
   * - `data`: The validated data or `null` if validation failed.
   */
  validate(value) {
    let errors = [];
    let validData = value;
    let isValid = true;

    if(value == null || value.length === 0){
      errors.push('Value is required')
      isValid = false;
      validData = null;

    }else if (typeof value !== 'string') {
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

    return isValid ? {valid: true, data: validData} : {valid: false, errors}
  }
}


module.exports = IntegerValidator;  // Ensure you export the class