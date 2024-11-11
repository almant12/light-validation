class EmailValidator {

    #regex(pattern,value) {
        // Adds a regex rule to the list of validation rules
            if (!pattern.test(value)) {
                return { valid: false, error: "email must be valid" };
            }
            return { valid: true, data: value }; // Use 'data' to return the validated value
    }

    #email(value) {
        // Updated email regex to properly match valid emails
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return this.#regex(emailPattern,value);
    }

    validate(value) {
        let errors = [];
        let validData = value; // Initialize with the original value
        let isValid = true;

        // check the value to email function
        const emailValidation = this.#email(value)

        if (typeof value !== 'string') {
            errors.push('Value must be a string.');
            isValid = false;
            validData = null;
        } else if (!emailValidation.valid){
            errors.push(emailValidation.error);
            isValid = false;
            validData = null; // If invalid, reset validData
        } else {
            validData = emailValidation.data; // Update validData with the result from the rule
        }

        return isValid ? { valid: true, data: validData } : { valid: false, errors };
    }
}

module.exports = EmailValidator;
