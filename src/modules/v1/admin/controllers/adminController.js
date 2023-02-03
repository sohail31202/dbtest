import JwtAuthSecurity from '~/libraries/JwtAuthSecurity';
import {
    commonHelpers
} from '~/helpers/commonHelpers'
import {
    adminService
} from '../services/adminService';
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
var adminServiceObj = new adminService();

/**
 * Get dashboard page function. 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getDashboard = async (req, res, next) => {
    adminServiceObj.getDashboard(req, res).then((returnData) => {
        
        // Return data into dashboard page.
        let data = {
            'title': 'Dashboard',
            'currentYear': currentYear,
            'intentLength': 0,
            "userLength": returnData.response.userLength,
            "reportedUserLength": 0
        };

        res.render('dashboard.ejs', data);
    })
}



// export all functions
const adminController = {

    getDashboard,
 
}

export default adminController