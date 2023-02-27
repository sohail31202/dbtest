import JwtAuthSecurity from '~/libraries/JwtAuthSecurity';
import {
    commonHelpers
} from '~/helpers/commonHelpers'
import {
    userService
} from '../services/userService';
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
import DateTimeUtil from "~/utils/DateTimeUtil";

const currentYear = DateTimeUtil.getCurrentYear();
var localeService = new LocaleService(i18n);
var userServiceObj = new userService();

/**
 * Get dashboard page function. 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getUser = async (req, res, next) => {
    userServiceObj.getUser(req).then(async (returnData) => {
        //For getting user page
        let data = {
            'title': 'Users',
            'currentYear': currentYear,
            "fetchData": returnData
        };
        res.render('user.ejs', data);
    })
}

const userlist  = (req, res, next) => {

    userServiceObj.userlist(req, res).then((returnData) => {
    })
}

const deleteUser = async (req, res, next) => {
    var response = {}
    userServiceObj.deleteUser(req).then((returnData) => {
        switch (returnData.status_code) {
            case StatusCodes.OK: //set success response 

                // Set ture response.
                response.status_code = StatusCodes.OK;
                response.message = localeService.translate('USER_DELETED');
                response.data = {};
                sendResponse(req, res, StatusCodes.OK, response);
                break;

            case StatusCodes.BAD_REQUEST: //set success response 

                // Set ture response.
                response.status_code = StatusCodes.BAD_REQUEST;
                response.message = returnData.message;
                response.data = {};
                sendErrorResponse(req, res, StatusCodes.BAD_REQUEST, response);
                break;

            default: //send default error response
                errorResponce(req, res, StatusCodes.INTERNAL_SERVER_ERROR);
                break;
        }

    }).catch((error) => {
        logger.error(error)
        // Set error response.
        errorResponce(req, res, StatusCodes.INTERNAL_SERVER_ERROR);
    })
}

const statusChanged = async (req, res, next) => {
    var response = {}
    userServiceObj.statusChanged(req).then((returnData) => {

        switch (returnData.status_code) {
            case StatusCodes.OK: //set success response 

                // Set ture response.
                response.status_code = StatusCodes.OK;
                response.message = localeService.translate('USER_STATUS_CHANGED');
                response.data = {};
                sendResponse(req, res, StatusCodes.OK, response);
                break;

            case StatusCodes.BAD_REQUEST: //set success response 

                // Set ture response.
                response.status_code = StatusCodes.BAD_REQUEST;
                response.message = localeService.translate('SOMETHING_WENT_WRONG');
                response.data = {};
                sendErrorResponse(req, res, StatusCodes.BAD_REQUEST, response);
                break;

            default: //send default error response
                errorResponce(req, res, StatusCodes.INTERNAL_SERVER_ERROR);
                break;
        }

    }).catch((error) => {
        logger.error(error)
        // Set error response.
        errorResponce(req, res, StatusCodes.INTERNAL_SERVER_ERROR);
    })
}


const userDetail = async (req, res, next) => {
    userServiceObj.getUserDetail(req).then((userData) => {
        userServiceObj.commoditylist(req).then((commodityData) => {
            let data = {
                'title': 'Users',
                'currentYear': currentYear,
                "userData": userData,
                "commodityData": commodityData
            };
            res.render('userDetail.ejs', data);
        })
    })

}

const userTransection = async(req, res, next) => {
    userServiceObj.userTransection(req).then(async (returnData) => {
        //For getting user page
        let data = {
            'title': 'Users',
            'currentYear': currentYear,
            "fetchData": returnData
        };
        // console.log("transection data>>>>>>>>>>>>>>>",data);
        res.render('user.ejs', data);
    })
}

const userTransectionlist  = (req, res, next) => {

    userServiceObj.userTransectionlist(req, res).then((returnData) => {
    })
}


// export all functions
const userController = {
    getUser,
    userlist,
    deleteUser,
    statusChanged,
    userDetail,
    userTransection,
    userTransectionlist
}

export default userController