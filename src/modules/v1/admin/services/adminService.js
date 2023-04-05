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
import { forEach } from "lodash";


const email = new Email();
const JwtAuthSecurityObj = new JwtAuthSecurity();
const s3BasePath = process.env.S3_BASE_PATH,
    imageFolder = commonConstants.IMAGE_FOLDER;
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
            // const intentLength = await AdminModelObj.fetchObj(IntentWhere, tableConstants.METADATA);

            const where = {
                "is_deleted": 0
            },
            salePurchaseCol = [
                "commodities.name",
                `CONCAT('${s3BasePath}${imageFolder}/', commodities.icon_image ) AS icon_image`,
                "COALESCE(SUM(users_transactions.commodity_in_gram), 0) as sale_commodity"
            ];
            
            const userLength = await AdminModelObj.fetchObj(where, tableConstants.USERS);
            const saleCommodityQuantity = await AdminModelObj.getSaleAndPurchaseCommodity(salePurchaseCol, [1, 8]);
            console.log("saleCommodityQuantity--", saleCommodityQuantity);
            const purchaseCommodityQuantity = await AdminModelObj.getSaleAndPurchaseCommodity();
            console.log("purchaseCommodityQuantity--", purchaseCommodityQuantity);
            
            for (let i = 0; i < saleCommodityQuantity.length; i++) {
                const element = saleCommodityQuantity[i];
                element.purchase_commodity = purchaseCommodityQuantity[i].purchase_commodity;
            }
            // Return response.
            let returnData = {
                "userLength": userLength.length,
                "saleAndPurchaseCommodity": saleCommodityQuantity
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