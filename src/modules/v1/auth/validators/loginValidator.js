import validateSchema from '~/utils/validate'

// create schema for request opt api
const schema = {
    type: "object",
    properties: {
        email: {
            type: "string",
            maxLength: 50,
            format: "email",
            errorMessage: {
                type: 'The email field must be a string',
                maxLength: 'Email field maximum 50 characters allowed.',
                format: 'Invalid email format.',
            },
        },
        password: {
            type: "string",
            minLength: 5,
            maxLength: 10,
            pattern: "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#$%^&*@!])",
            errorMessage: {
                type: 'The password field must be a string.',
                minLength: 'Password should minimum of 5 characters.',
                maxLength: 'Password should be a maximum of 10 characters.',
                pattern: 'Password must contain at least one uppercase, lowercase, number, and a special character.',
            },
        },
    },
    required: ["email", "password"], //set required paramenter
    additionalProperties: true, //make addition parameter allow in request body by makeing additionalProperties =true 
}


// login field validation 
export const loginValidator = function(req, res, next) {

    const isValid = validateSchema(req, schema);
    //check if isvalid status false return validation response
    if (isValid.status == false) {
        // return response 
        return res.status(isValid.status_code).json(isValid.error);
    }
    next();
}