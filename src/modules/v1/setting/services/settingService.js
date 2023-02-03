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
        const res = {
            "status": true,
            "status_code": StatusCodes.OK,
            "response": 'success'
        };
        console.log("commonHelpers.unEscape(req.body.content)", commonHelpers.unEscape(req.body.content));
        try {
            // Set current time.
            const currentTime = DateTimeUtil.getCurrentTimeObjForDB(),
                pageType = req.body.pageType,
                adminId = req.session.adminId,
                where = {
                    "page_type": pageType
                },
                updateContent = {
                    "page_content": commonHelpers.unEscape(req.body.content),
                    "updated_at": currentTime
                };

            // Fetch page content.
            const fetchData = await SettingModelObj.fetchObj(where, tableConstants.APP_STATIC_PAGE_CONTENT);

            if( fetchData.length > 0 ) {
                updateContent.updated_by = adminId;
                // Updated into table.
                await SettingModelObj.updateObj(updateContent, where, tableConstants.APP_STATIC_PAGE_CONTENT);
            
                return res;
            }else {
                updateContent.page_type = pageType;
                updateContent.created_at = currentTime;
                updateContent.created_by = adminId;
                // Insert into table.
                await SettingModelObj.createObj(updateContent, tableConstants.APP_STATIC_PAGE_CONTENT);
                
                return res;
            }

        } catch (error) {
            return error;
        }
    }
}