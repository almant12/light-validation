class ObjectSchema {
  constructor(schema) {
    this.schema = schema;
  }

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