import SettingModel from "../models/SettingModel";
import tableConstants from '~/constants/tableConstants';
import commonConstants from '~/constants/commonConstants';
import customResponseCode from '~/constants/customResponseCode';
import {
    StatusCodes
} from "http-status-codes";
import commonHelpers from '~/helpers/commonHelpers'
import DateTimeUtil from "~/utils/DateTimeUtil";
import passwordHash from "~/utils/passwordHash";
import Email from "~/libraries/Email";
import JwtAuthSecurity from "~/libraries/JwtAuthSecurity";
import htmlspecialchars from 'htmlspecialchars';

const email = new Email();
const JwtAuthSecurityObj = new JwtAuthSecurity();
const SettingModelObj = new SettingModel();
const currentTime = DateTimeUtil.getCurrentTimeObjForDB();

/**
 * creating SettingModel object for access the database 
 */
export class settingService {


    /**
     * Terms & conditions services.
     * @param {*} req 
     * @returns 
     */
    async termsAndConditions(req) {
        try {
            // Set where page_type.
            const where = {
                "page_type": "term_and_condition"
            }
            // Fetch page content.
            const fetchData = await SettingModelObj.fetchObj(where, tableConstants.APP_STATIC_PAGE_CONTENT);
            
            return fetchData[0];

        } catch (error) {
            return error;
        }
    }


    /**
     * About us services.
     * @param {*} req 
     * @returns 
     */
    async privacyPolicy(req) {

        try {
            // Set where page_type.
            const where = {
                "page_type": "privacy_policy"
            }
            // Fetch page content.
            const fetchData = await SettingModelObj.fetchObj(where, tableConstants.APP_STATIC_PAGE_CONTENT);

            return fetchData[0];

        } catch (error) {
            return error;
        }
    }


    /**
    * Update terms & coditions services.
    * @param {*} req 
    * @returns 
    */
    async updateContentPage(req) {

        try {
            // Set current time.
            var currentTime = DateTimeUtil.getCurrentTimeObjForDB();

            // Set where page_type.
            const where = {
                "page_type": req.body.pageType
            }

            // Set updated data into table.
            const updateContent = {
                "page_content": commonHelpers.unEscape(req.body.content),
                "updated_by": req.session.adminId,
                "updated_at": currentTime
            }

            // Updated into table.
            await SettingModelObj.updateObj(updateContent, where, tableConstants.APP_STATIC_PAGE_CONTENT);

            let res = {
                "status": true,
                "status_code": StatusCodes.OK,
                "response": 'success'
            }

            return res;

        } catch (error) {
            return error;

        }
    }
}