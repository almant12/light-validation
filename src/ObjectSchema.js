/**
 * Class to validate objects against a predefined schema.
 */
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
}

module.exports = ObjectSchema;
