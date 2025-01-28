const { validateType, validateRules } = require('./until/validationHelper');

class StringValidator {
  #rules;
  #allowNull;
  #isArray;

  constructor() {
    this.#rules = [];
    this.#allowNull = false; // Flag to indicate if null values are allowed
    this.#isArray = false;
  }

  /**
   * Adds a rule to allow null or empty strings as valid inputs.
   */
  nullable() {
    this.#allowNull = true; // Enable nullable behavior
    return this; // Return the instance for chaining
  }

  /**
   * Allows validation for an array of strings.
   */
  array() {
    this.#isArray = true; // Enable array validation
    return this;
  }

  /**
   * Adds a rule to ensure the string has at least the specified number of characters.
   * 
   * @param {number} length - The minimum number of characters required.
   * @param {Object} [options] - Optional parameters.
   * @param {string} [options.message] - Custom error message.
   */
  min(length, options = {}) {
    const message = `must be at least ${length} characters long.`;
    this.#rules.push((value, fieldName) => {
      if (value.length < length) {
        return { valid: false, error: options.message || `${fieldName} ${message}` };
      }
      return { valid: true, value };
    });
    return this;
  }

  /**
   * Adds a rule to ensure the string has no more than the specified number of characters.
   * 
   * @param {number} length - The maximum number of characters allowed.
   * @param {Object} [options] - Optional parameters.
   * @param {string} [options.message] - Custom error message.
   */
  max(length, options = {}) {
    const message = `must be no more than ${length} characters long.`;
    this.#rules.push((value, fieldName) => {
      if (value.length > length) {
        return { valid: false, error: options.message || `${fieldName} ${message}` };
      }
      return { valid: true, value };
    });
    return this;
  }


   /**
   * Validates the provided value against all applied rules.
   * 
   * @param {string|null|Array} value - The string or array to validate.
   * @param {Object} [options] - Optional parameters for the validation.
   * @param {string} [options.fieldName='value'] - The name of the field being validated. 
   *                                            Defaults to 'value' if not provided. 
   * @returns {Object} - Validation result:
   *   - `valid` (`boolean`): True if all rules pass, otherwise false.
   *   - `errors` (`string[]`): An array of error messages, if validation fails.
   *   - `data` (`string|null|Array`): The validated value if valid, otherwise null.
   */
   validate(value, options = {}) {
    const { fieldName = 'value' } = options;
    let errors = [];
    let validData = value;
    let isValid = true;

    // Step 1: Handle null/empty and type validation based on whether it's an array
    const typeValidationResult = validateType(value, fieldName, this.#isArray);
    if (!typeValidationResult.isValid) {
      errors.push(typeValidationResult.error);
      isValid = false;
      validData = null;
    }

    // Step 2: Handle null/empty value validation for non-nullable fields
    if (isValid && value != null && value.length === 0 && !this.#allowNull) {
      errors.push(`${fieldName} is required`);
      isValid = false;
      validData = null;
    }

    // Step 3: Run the validation rules if the value is valid so far
    if (isValid) {
      const ruleValidationResult = validateRules(value, fieldName, this.#rules);
      if (!ruleValidationResult.isValid) {
        errors.push(...ruleValidationResult.errors);
        validData = null;
      } else {
        validData = ruleValidationResult.value;
      }
    }

    return isValid ? { valid: true, data: validData } : { valid: false, errors };
  }
}

module.exports = StringValidator;
