class EmailValidator {



    constructor() {
        this.rules = []; // Store validation rules
    }

    // Adds a regex rule to the list of validation rules
    #regex(pattern, value) {
        if (!pattern.test(value)) {
            return { valid: false, error: "Email must be valid." };
        }
        return { valid: true, data: value };
    }

    // Email regex pattern
    #email(value) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return this.#regex(emailPattern, value);
    }

    // Adds a min length rule to the list of validation rules
    max(length, options = {}) {
        this.rules.push((value) => {
            if (value.length > length) {
                return { valid: false, error: options.message || `Email must be at least ${length} characters long.` };
            }
            return { valid: true, data: value };
        });
        return this; // Allow chaining
    }

    // Validate function to process all rules
    validate(value) {
        let errors = [];
        let validData = value;
        let isValid = true;

        if (typeof value !== 'string') {
            errors.push('Value must be a string.');
            isValid = false;
            validData = null;
        } else {
        
            const emailValidation = this.#email(value);

            if (!emailValidation.valid) {
                errors.push(emailValidation.error);
                isValid = false;
                validData = null;
            } else {
                validData = emailValidation.data;
            }

             // Apply all rules in the `rules` array, including max
             for (let rule of this.rules) {
                const result = rule(value);

                if (!result.valid) {
                    errors.push(result.error);
                    isValid = false;
                    validData = null; // Reset validData if invalid
                } else {
                    validData = result.data; // Update validData if valid
                }
            }
        }

        return isValid ? { valid: true, data: validData } : { valid: false, errors };
    }
}

module.exports = EmailValidator;
