class ObjectSchema {
  constructor(schema) {
    this.schema = schema;
  }

  /**
   * Validates the provided data object against the schema.
   * @param {Object} data - The object to validate.
   * @returns {Object} - An object containing:
   * - `success`: `true` if validation passed, `false` if any field failed.
   * - `errors`: Object with error messages for each invalid field.
   * - `data`: The validated data object or `null` if validation failed.
   */
  safeParse(data) {
    const errors = {};
    const validData = {};
    let isValid = true;

    const schemaKeys = Object.keys(this.schema);
    const dataKeys = Object.keys(data);

    for (let key of schemaKeys) {
      if (!dataKeys.includes(key)) {
        errors[key] = `${key} is required.`;
        isValid = false;
      }
    }

    if (isValid) {
      for (let key in this.schema) {
        const result = this.schema[key].validate(data[key]);

        if (!result.valid) {
          errors[key] = result.errors[0];
          isValid = false;
        } else {
          validData[key] = data[key];
        }
      }
    }

    return isValid ? { success: true, data: validData } : { success: false, errors };
  }
}


module.exports = ObjectSchema;  // Ensure you export the class