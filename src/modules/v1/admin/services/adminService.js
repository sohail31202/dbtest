import AdminModel from "../models/AdminModel";
import tableConstants from '~/constants/tableConstants';
import commonConstants from '~/constants/commonConstants';
import envConstants from "~/constants/envConstants";
import folderConstants from "~/constants/folderConstants";
import customResponseCode from '~/constants/customResponseCode';
import {
    StatusCodes
} from "http-status-codes";
import commonHelpers from '~/helpers/commonHelpers'
import DateTimeUtil from "~/utils/DateTimeUtil";
import passwordHash from "~/utils/passwordHash";
import Email from "~/libraries/Email";
import JwtAuthSecurity from "~/libraries/JwtAuthSecurity";


const email = new Email();
const JwtAuthSecurityObj = new JwtAuthSecurity();
const AdminModelObj = new AdminModel();


const currentTime = DateTimeUtil.getCurrentTimeObjForDB();

/**
 * creating AdminModel object for access the database 
 */
export class adminService {

    /**
     * Get dashboard page services.
     * @param {*} req 
     * @returns 
     */
    async getDashboard(req) {

        try {
            let IntentWhere = {
                data_ref_key: "profile_intention"
            }
            // Get contact table length.
            const intentLength = await AdminModelObj.fetchObj(IntentWhere, tableConstants.METADATA);

            const where = {
                "user_type": 2
            }
            const userLength = await AdminModelObj.fetchObj(where, tableConstants.USERS);

            const reportedUserLength = await AdminModelObj.fetchAll(tableConstants.REPORTED_USERS);

            // Return response.
            let returnData = {
                "intentLength": intentLength.length,
                "userLength": userLength.length,
                "reportedUserLength": reportedUserLength.length
            }

            // Return true response.
            let res = {
                'status': true,
                'status_code': StatusCodes.OK,
                'response': returnData
            }
            return res;

        } catch (error) {
            console.log(error);
            return error;

        }
    }
}