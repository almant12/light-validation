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
   * Adds a rule to validate the file size.
   * @param {number} maxSizeMB - Maximum allowed file size in MB.
   * @param {Object} [options] - Optional parameters.
   * @param {string} [options.message] - Custom error message.
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
   * Validates the provided file(s) against all applied #rules.
   * Supports both single file and multiple files.
   * 
   * @param {File|File[]|null} files - A single file, array of files, or null.
   * @param {Object} [options] - Optional parameters for the validation.
   * @param {string} [options.fieldName='file'] - The name of the field being validated.
   * @returns {Object} - Validation result:
   *   - `valid` (`boolean`): True if all files pass, otherwise false.
   *   - `errors` (`string[]`): An array of error messages, if validation fails.
   *   - `data` (`File[]|File|null`): The validated file(s) if valid, otherwise null.
   */
  validate(files, options = {}) {
    const { fieldName = "file" } = options;
    const errors = [];
    const validatedFiles = [];
    let isValid = true;
  
    // Check if files are null or empty, and null is allowed
    if (files == null || (Array.isArray(files) && files.length === 0)) {
      if (this.#allowNull) {
        return { valid: true, data: null };
      }
      errors.push(`${fieldName} is required`);
      return { valid: false, errors, data: null };
    }
  
    // Normalize single file to an array
    const fileArray = Array.isArray(files) ? files : [files];
  
    // Iterate over each file
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
  
      // Validate if the file is a valid object
      if (typeof file !== "object" || !file.type || !file.size) {
        errors.push(`${fieldName} ${i} invalid format`);
        isValid = false;
        continue;
      }
  
      let fileIsValid = true;
  
      // Apply each rule to the current file
      for (let rule of this.#rules) {
        const result = rule(file, `${fieldName} ${i}`);
        if (!result.valid) {
          errors.push(result.error);
          fileIsValid = false;
          isValid = false;
          break; // Stop checking rules for this file
        }
      }
  
      if (fileIsValid) {
        validatedFiles.push(file); // Add valid file
      }
    }
  
    // Determine the return structure: single object or array
    const finalData =
      validatedFiles.length === 1 ? validatedFiles[0] : validatedFiles;
  
    return isValid
      ? { valid: true, data: finalData }
      : { valid: false, errors, data: null };
  }
  
}

module.exports = FileValidator;
