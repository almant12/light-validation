class ObjectSchema {
  /**
   * Initializes the schema for validation.
   * @param {Object} schema - An object where each key represents a field, and the value is a validator with a `validate` method.
   */
  constructor(schema) {
    this.schema = schema;
  }

  /**
   * Validates the provided data object against the schema.
   * @param {Object} data - The object to validate, where each key corresponds to a schema-defined field.
   * @returns {Object} - Validation result:
   *   - If valid:
   *     - `valid` (boolean): `true`.
   *     - `data` (Object): Cleaned and validated data object.
   *   - If invalid:
   *     - `valid` (boolean): `false`.
   *     - `errors` (Object): An object with error messages, keyed by field name.
   */
  parseData(data) {
    const errors = {};
    const validData = {};
    let isValid = true;

    for (let key in this.schema) {
      const validator = this.schema[key];
      const value = data[key] ?? null; // Handle missing keys as `null`

      // Check if the password field is being validated
      if (key === 'password') {
        // Validate password confirmation logic
        const confirmationResult = this.#validatePasswordConfirmation(data);
        if (!confirmationResult.valid) {
          errors['password_confirmation'] = confirmationResult.error;
          isValid = false;
        }
      }

      // Validate the current field
      const result = validator.validate(value, { fieldName: key });

      if (!result.valid) {
        errors[key] = result.errors[0];
        isValid = false;
      } else {
        validData[key] = result.data;
      }
    }

    return isValid ? { valid: true, data: validData } : { valid: false, errors };
  }

  /**
   * Validates that the password and password_confirmation fields match.
   * @param {Object} data - The data object being validated.
   * @returns {Object} - Validation result:
   *   - `valid` (boolean): True if the passwords match, false if they don't.
   *   - `error` (string): Error message if the passwords don't match.
   */
  #validatePasswordConfirmation(data) {
    const password = data['password'];
    const confirmPassword = data['password_confirmation'];

    // If password_confirmation is provided and doesn't match, return error
    if (confirmPassword !== undefined && password !== confirmPassword) {
      return { valid: false, error: 'Password do not match' };
    }
    
    return { valid: true };
  }
}

module.exports = ObjectSchema;
