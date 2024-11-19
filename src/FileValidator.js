/**
 * Class for validating file uploads with customizable rules.
 * Supports file type, size, and required presence validation.
 */
class FileValidator {
  #rules; // Private attribute for storing validation rules
  #allowNull; // Private attribute for nullable file option

  constructor() {
    this.#rules = []; // Initialize rules array
    this.#allowNull = false; // Default is not allowing null files
  }

  /**
   * Allows the file to be nullable (can be null or empty).
   * @returns {FileValidator} - The `FileValidator` instance with the `nullable` rule applied.
   */
  nullable() {
    this.#allowNull = true;
    return this; // Enable chaining
  }

  /**
   * Adds a rule to validate the file type (e.g., MIME type).
   * @param {string[]} allowedTypes - List of allowed MIME types.
   * @param {Object} [options] - Optional parameters.
   * @param {string} [options.message] - Custom error message.
   * @returns {FileValidator} - The `FileValidator` instance with the `type` rule applied.
   */
  type(allowedTypes, options = {}) {
    const message = options.message || `File type must be one of: ${allowedTypes.join(', ')}`;
    this.#rules.push((file) => {
      if (!allowedTypes.includes(file.mimetype)) {
        return { valid: false, error: message };
      }
      return { valid: true, data: file };
    });
    return this; // Enable chaining
  }

  /**
   * Adds a rule to validate the file size (in bytes).
   * @param {number} maxSizeMB - Maximum allowed file size in MB.
   * @param {Object} [options] - Optional parameters.
   * @param {string} [options.message] - Custom error message.
   * @returns {FileValidator} - The `FileValidator` instance with the `size` rule applied.
   */
  maxSize(maxSizeMB, options = {}) {
    const message = options.message || `File size must not exceed ${maxSizeMB} MB.`;
    const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes

    this.#rules.push((file) => {
      if (file.size > maxSizeBytes) {
        return { valid: false, error: message };
      }
      return { valid: true, data: file };
    });
    return this; // Enable chaining
  }

  /**
   * Validates the provided file against all applied rules.
   * @param {Object|null} file - The file object to validate.
   * @returns {Object} - Validation result:
   *   - `valid` (`boolean`): True if all rules pass, otherwise false.
   *   - `errors` (`string[]`): An array of error messages if validation fails.
   *   - `data` (`Object|null`): The validated file if valid, otherwise null.
   */
  validate(file) {
    let errors = [];
    let validData = file;
    let isValid = true;

    // If the file is null or empty and null is allowed
    if (file == null || (Array.isArray(file) && file.length === 0)) {
      if (this.#allowNull) {
        return { valid: true, data: null }; // Return null if file is allowed to be null
      }
      errors.push('File is required');
      isValid = false;
      validData = null;
    } else {
      // Check if the file is an object (assumed to be a file object)
      if (typeof file !== 'object' || !file.type) {
        errors.push('Invalid file format');
        isValid = false;
        validData = null;
      } else {
        // Apply rules from the `#rules` array
        for (let rule of this.#rules) {
          const result = rule(file);
          if (!result.valid) {
            errors.push(result.error);
            isValid = false;
            validData = null;
          } else {
            validData = result.data;
          }
        }
      }
    }

    return isValid ? { valid: true, data: validData } : { valid: false, errors };
  }
}

module.exports = FileValidator;
