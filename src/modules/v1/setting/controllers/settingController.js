import JwtAuthSecurity from '~/libraries/JwtAuthSecurity';
import {
    commonHelpers
} from '~/helpers/commonHelpers'
import {
    settingService
} from '../services/settingService';
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
import DateTimeUtil from "~/utils/DateTimeUtil";
const currentYear = DateTimeUtil.getCurrentYear();

var settingServiceObj = new settingService();

/**
 * Create function for edit terms and conditions.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const editTermsAndConditions = async (req, res, next) => {

    settingServiceObj.termsAndConditions(req, res).then((returnData) => {

        let data = {
            'title': 'Edit Terms & Conditions',
            'currentYear': currentYear,
            "fetchData": returnData
        };

        res.render('edit_terms_and_conditions.ejs', data);
    })
}


/**
 * Create function for edit privacy Policy.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const editPrivacyPolicy = async (req, res, next) => {

    settingServiceObj.privacyPolicy(req, res).then((returnData) => {

        let data = {
            'title': 'Edit Privacy Policy',
            'currentYear': currentYear,
            "fetchData": returnData
        };

        res.render('edit_privacy.ejs', data);
    })
}

/**
 * Create function for update content page.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const updateContentPage = (req, res, next) => {

    var response = {}
    settingServiceObj.updateContentPage(req).then((returnData) => {

        switch (returnData.status_code) {
            case StatusCodes.OK: //set success response 

                // Set ture response.
                response.status_code = StatusCodes.OK;
                response.message = localeService.translate('CONTENT_UPDATED');
                response.data = {};
                sendResponse(req, res, StatusCodes.OK, response);
                break;

            default: //send default error response
                errorResponce(req, res, StatusCodes.INTERNAL_SERVER_ERROR);
                break;
        }

    }).catch((error) => {

        // Set error response.
        sendErrorResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR);
    });
}

/**
 * Terms & condition page.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const termsAndConditions = async (req, res, next) => {

    settingServiceObj.termsAndConditions(req, res).then((returnData) => {

        let data = {
            'title': 'Terms & Conditions',
            "fetchData": returnData
        };

        res.render('terms_and_conditions_page.ejs', data);
    })
}

/**
 * Privacy Policy page.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const privacyPolicy = async (req, res, next) => {

    settingServiceObj.privacyPolicy(req, res).then((returnData) => {

        let data = {
            'title': 'Privacy Policy',
            "fetchData": returnData
        };

        res.render('privacy_page.ejs', data);
    })
}

// export all functions
const settingController = {

    editTermsAndConditions,
    editPrivacyPolicy,
    updateContentPage,
    termsAndConditions,
    privacyPolicy

}

export default settingController