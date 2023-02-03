/**
 * Middleware to sanitizing and triming JSON body requests.
 *
 * @param  {Object}   request
 * @param  {Object}   response
 * @param  {Function} next
 */
export const responseHandler = function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    response.header("Access-Control-Allow-Headers", "Content-Type");
    next();
};

/*
 *set success response 
 */
export const sendResponse = function(request, response, HttpStatus, responseData) {
    const responseObj = {
        "status": "success",
        "status_code": responseData.status_code,
        "message": responseData.message,
        "data": responseData.data
    };
    return response.status(HttpStatus).json(responseObj);
};

/*
 *set error response 
 */

export const sendErrorResponse = function(request, response, HttpStatus, responseData) {
    const responseObj = {
        "status": "fail",
        "status_code": responseData.status_code,
        "message": responseData.message,
        "data": responseData.data
    };
    return response.status(HttpStatus).json(responseObj);
};