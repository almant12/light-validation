

/**
 * Validates the type of the value (string or array).
 * 
 * @param {string|null|Array} value - The value to validate.
 * @param {string} fieldName - The name of the field.
 * @param {boolean} isArray - Flag to indicate if it's an array.
 * @returns {Object} - Contains `isValid` and `error` (if any).
 */
function validateType(value, fieldName, isArray) {
    if (isArray) {
      if (!Array.isArray(value)) {
        return { isValid: false, error: `${fieldName} must be an array` };
      }
  
      for (let index = 0; index < value.length; index++) {
        if (typeof value[index] !== 'string') {
          return { isValid: false, error: `${fieldName}[${index}] must be a string` };
        }
      }
    } else if (value != null && typeof value !== 'string') {
      return { isValid: false, error: `${fieldName} must be a string` };
    }
  
    return { isValid: true, error: null };
  }
  
  /**
   * Validates the rules applied to the value.
   * 
   * @param {string|null|Array} value - The value to validate.
   * @param {string} fieldName - The name of the field.
   * @param {Array} rules - The validation rules.
   * @returns {Object} - Contains `isValid` and `errors` (if any).
   */
  function validateRules(value, fieldName, rules) {
    let errors = [];
    let isValid = true;
    let validData = value;
  
    for (let rule of rules) {
      const result = rule(value, fieldName);
      if (!result.valid) {
        errors.push(result.error);
        isValid = false;
        validData = null;
      } else {
        validData = result.value;
      }
    }
  
    return { isValid, errors, value: validData };
  }
  
  module.exports = {
    validateType,
    validateRules
  };
  