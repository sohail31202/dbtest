import {
    ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,
} from 'http-status-codes';

/**
 * Error response middleware for 404 not found.
 *
 * @param {Object} req
 * @param {Object} res
 */
export const notFound = function(req, res) {

    const responseObj = {

        "status": "fail",
        "status_code": StatusCodes.NOT_FOUND,
        "message": getReasonPhrase(StatusCodes.NOT_FOUND),
        "data": {}

    }
    return res.status(StatusCodes.NOT_FOUND).json(responseObj);
};

/**
 * Error Responce  middleware for create responce using error code .
 *
 * @param  {number}   status error code 
 */

export const errorResponce = function(req, res, status) {

    const responseObj = {

        "status": "fail",
        "status_code": status,
        "message": getReasonPhrase(status),
        "data": {}

    }
    return res.status(status).json(responseObj);

}