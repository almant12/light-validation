class PasswordValidator{
    constructor(){
        this.rules = [];
    }
     /**
   * Validates the string using a regular expression.
   * @param {RegExp} pattern - Regular expression pattern to match the string.
   * @param {Object} error - Custom error message.
   * @returns {StringValidator} - The `StringValidator` instance with the `regex` rule applied.
   */
  #regex(pattern, value,errorMessage) {
      if (!pattern.test(value)) {
        return { valid: false, error: errorMessage };
      }
      return { valid: true, value };
  }

  containsNumber(){
    const pattern = /[0-9]/;
    const message = 'Password must contain at least one number.'
    this.rules.push((value)=>{
        const result = this.#regex(pattern,value,message)
        return result;
    })
    return this;
  }

  containsSpecialChar(){
    const pattern = /[!@#$%^&*(),.?":{}|<>]/;
    const message = 'Password must contain at least one special character.';
    this.rules.push((value)=>{
        const result = this.#regex(pattern,value,message);
        return result;
    })
    return this;
  }

  min(length) {
    // Add a minimum length rule to the rules array
    this.rules.push((value) => {
        if (value.length < length) {
            return { valid: false, error: `Password must be at least ${length} characters long.` };
        }
        return { valid: true };
    });
    return this; // Enable chaining
    }



    validate(value) {
        let errors = [];
        let validData = value;
        let isValid = true;
    
        if(value.length === 0){
            errors.push('Value is required')
            isValid = false;
            validData = null;
      
          }else if (typeof value !== 'string') {
            errors.push('Value must be a string.');
            isValid = false;
            validData = null;
            
        } else {
          for (let rule of this.rules) {
            const result = rule(value);
    
            if (!result.valid) {
              errors.push(result.error);
              isValid = false;
              validData = null;
            } else {
              validData = result.value;
            }
          }
        }
    
        return isValid ? {valid: true, data:validData} : {valid: false, errors}
      }
}


module.exports = PasswordValidator; 