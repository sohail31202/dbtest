import validateSchema from '~/utils/validate'
// create schema for request opt api
const schema = {
    type: "object",
    properties: {
        content: {
            type: "string",
            minLength: 5,
            errorMessage: {
                type: 'The content field must be a string',
                minLength: 'Content field should be minimum 5 characters allowed.'
            },
        },
    },
    required: ["content"], //set required paramenter
    additionalProperties: true, //make addition parameter allow in request body by makeing additionalProperties =true 
}

// send otp field validation 
export const updateContentValidator = function(req, res, next) {

    const isValid = validateSchema(req, schema);
    //check if isvalid status false return validation response
    if (isValid.status == false) {
        // return response 
        return res.status(isValid.status_code).json(isValid.error);
    }
    next();
}