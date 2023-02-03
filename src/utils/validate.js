import { StatusCodes } from "http-status-codes";
const Ajv = require("ajv");
var normalise = require('ajv-error-messages');
const addFormats = require("ajv-formats");
const ajv = new Ajv({ useDefaults: true, allErrors: true, coerceTypes: true, $data: true });
addFormats(ajv);
require("ajv-errors")(ajv, { singleError: true })

const validateSchema = function(req, schema) {
    // compile  schema
    const validate = ajv.compile(schema);
    // check validation using request body 
    const valid = validate(req.body);
    // check if req body fail validation then set error response
    if (!valid) {
        // get error object from validate
        var ajvErrors = validate.errors;
        // normalize error 
        var normalisedErrors = normalise(ajvErrors);
        // get fist error message 
        var errorFirstMsg = validate.errors[0].message;
        var resMsg = (errorFirstMsg.substring(0, errorFirstMsg.indexOf(';')) != '') ? (errorFirstMsg.substring(0, errorFirstMsg.indexOf(';'))) : errorFirstMsg;

        // set validation error response
        const responseObj = { "status": "fail", "status_code": StatusCodes.BAD_REQUEST, "message": resMsg, "data": normalisedErrors };
        // return 
        return { 'status': false, 'status_code': StatusCodes.BAD_REQUEST, 'error': responseObj };
    }
    // set response when validation pass
    return { 'status': true, 'error': '' };

}

export default validateSchema;