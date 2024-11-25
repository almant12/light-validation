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
  type(allowedExtensions, options = {}) { 
    // Map common extensions to MIME types
    const mimeTypes = {
      jpg: 'image/jpg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      pdf: 'application/pdf',
      txt: 'text/plain',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
  
    // Validate extensions and collect MIME types
    const allowedMimeTypes = [];
    const invalidExtensions = [];
  
    allowedExtensions.forEach(ext => {
      const mimeType = mimeTypes[ext.toLowerCase()];
      if (mimeType) {
        allowedMimeTypes.push(mimeType);
      } else {
        invalidExtensions.push(ext);
      }
    });
  
    // Throw an error if any extensions are invalid
    if (invalidExtensions.length > 0) {
      throw new Error(
        `Invalid file extensions provided: ${invalidExtensions.join(', ')}.`
      );
    }
  
    // Validation message
    const message = `must be of type: ${allowedExtensions.join(', ')}`;
  
    // Add rule to the validator
    this.#rules.push((file,fieldName) => {
      if (!allowedMimeTypes.includes(file.type)) {
        return { valid: false, error: options.message || `${fieldName} ${message}` };
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
    const message =`size must not exceed ${maxSizeMB} MB`;
    const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes

    this.#rules.push((file,fieldName) => {
      if (file.size > maxSizeBytes) {
        return { valid: false, error: options.message || `${fieldName} ${message}` };
      }
      return { valid: true, data: file };
    });
    return this; // Enable chaining
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
  validate(file,options = {}) {
    const {fieldName = 'file'} = options;
    let errors = [];
    let validData = file;
    let isValid = true;

    // If the file is null or empty and null is allowed
    if (file == null || (Array.isArray(file) && file.length === 0)) {
      if (this.#allowNull) {
        return { valid: true, data: null }; // Return null if file is allowed to be null
      }
      errors.push(`${fieldName} is required`);
      isValid = false;
      validData = null;
    } else {
      // Check if the file is an object (assumed to be a file object)
      if (typeof file !== 'object' || !file.type) {
        errors.push(`${fieldName} invalid format`);
        isValid = false;
        validData = null;
      } else {
        // Apply rules from the `#rules` array
        for (let rule of this.#rules) {
          const result = rule(file,fieldName);
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
