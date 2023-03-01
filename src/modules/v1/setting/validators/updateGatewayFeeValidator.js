import validateSchema from '~/utils/validate'
// create schema for request opt api
const schema = {
    type: "object",
    properties: {
        feeUsd: {
            type: "string",
            minLength: 1,
            maxLength: 5,
            errorMessage: {
                maxLength: 'Invalid fee percent in USD.',
                minLength: 'Invalid fee percent in USD.'
            }
        },
        flatUsd: {
            type: "string",
            minLength: 1,
            maxLength: 6,
            errorMessage: {
                maxLength: 'Invalid fee in USD.',
                minLength: 'Invalid fee in USD.'
            }
        },
        feeEuro: {
            type: "string",
            minLength: 1,
            maxLength: 5,
            errorMessage: {
                maxLength: 'Invalid fee percent in EURO.',
                minLength: 'Invalid fee percent in EURO.'
            }
        },
        flatEuro: {
            type: "string",
            minLength: 1,
            maxLength: 6,
            errorMessage: {
                maxLength: 'Invalid fee in EURO.',
                minLength: 'Invalid fee in EURO.'
            }
        },
        feeCad: {
            type: "string",
            minLength: 1,
            maxLength: 5,
            errorMessage: {
                maxLength: 'Invalid fee percent in CAD.',
                minLength: 'Invalid fee percent in CAD.'
            }
        },
        flatCad: {
            type: "string",
            minLength: 1,
            maxLength: 6,
            errorMessage: {
                maxLength: 'Invalid fee in CAD.',
                minLength: 'Invalid fee in CAD.'
            }
        },
        _csrf: {
            type: "string",
            minLength: 1,
            maxLength: 100,
            errorMessage: {
                maxLength: 'Invalid token.',
                minLength: 'Invalid token.'
            }
        }
    },
    required: ["feeUsd", "flatUsd", "feeEuro", "flatEuro", "feeCad", "flatCad", "_csrf"], //set required paramenter
    additionalProperties: true, //make addition parameter allow in request body by makeing additionalProperties =true 
}

// send otp field validation 
export const updateGatewayFeeValidator = function(req, res, next) {

    const isValid = validateSchema(req, schema);
    //check if isvalid status false return validation response
    if (isValid.status == false) {
        // return response 
        return res.status(isValid.status_code).json(isValid.error);
    }
    next();
}