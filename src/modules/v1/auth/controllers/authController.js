import JwtAuthSecurity from '~/libraries/JwtAuthSecurity';
import {
    commonHelpers
} from '~/helpers/commonHelpers'
import {
    authService
} from '../services/authService';
import {
    sendResponse,
    sendErrorResponse
} from "~/middlewares/responseHandler";
import {
    errorResponce
} from "~/middlewares/errorHandler";
import {
    StatusCodes
} from "http-status-codes";
import customResponseCode from "~/constants/customResponseCode"
import i18n from "~/config/i18n.config";
import {
    LocaleService
} from "~/utils/localeService";
var localeService = new LocaleService(i18n);


var authServiceObj = new authService();

/**
 * Get login page function.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const login = async (req, res, next) => {
 
    if (req.session.adminId) {
        res.redirect("/dashboard");
    } else {
        res.render('login.ejs', { csrfToken : req.csrfToken() });
    }
}

/**
 * Verify admin function.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const verifyLogin = async (req, res, next) => {
 
    // Set response.
    const response = {};

    authServiceObj.verifyLogin(req).then((returnData) => {

        switch (returnData.status_code) {
            case StatusCodes.OK: //set success response 

                // Set ture response.
                response.status_code = StatusCodes.OK;
                response.message = localeService.translate('LOGIN_SUCCESS');
                response.data = returnData.response;
                sendResponse(req, res, StatusCodes.OK, response);
                break;

            case StatusCodes.BAD_REQUEST: //set not found response 
                response.status_code = StatusCodes.BAD_REQUEST;
                response.message = localeService.translate('ACCONUT_INACTIVE');
                response.data = returnData.response;
                sendErrorResponse(req, res, StatusCodes.BAD_REQUEST, response);
                break;

            case StatusCodes.ACCONUT_NOT_FOUND: //set not found response 
                response.status_code = StatusCodes.BAD_REQUEST;
                response.message = localeService.translate('ACCONUT_NOT_FOUND');
                response.data = returnData.response;
                sendErrorResponse(req, res, StatusCodes.BAD_REQUEST, response);
                break;

            case customResponseCode.NOT_MATCHED: //set not found response 
                response.status_code = customResponseCode.NOT_MATCHED;
                response.message = localeService.translate('INVALID_PASSWORD');
                response.data = returnData.response;
                sendErrorResponse(req, res, customResponseCode.NOT_MATCHED, response);
                break;

                default: //send default error response
                errorResponce(req, res, StatusCodes.INTERNAL_SERVER_ERROR);
                break;
        }

    }).catch((error) => {
        // Set error response.
        errorResponce(req, res, StatusCodes.INTERNAL_SERVER_ERROR);
    });

}

/**
 * Admin logout function.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const logout = async (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
}

// export all functions
const authController = {
    login,
    verifyLogin,
    logout

}

export default authController