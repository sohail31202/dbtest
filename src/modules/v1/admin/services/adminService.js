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
import { filter, forEach, result } from "lodash";


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
                    "COALESCE(SUM(users_transactions.commodity_in_gram), 0) as sale_commodity",
                    "commodities.id as commodity_id"
                ];

            const userLength = await AdminModelObj.fetchObj(where, tableConstants.USERS);
            const totalProfit = await AdminModelObj.fetchTotalProfit(tableConstants.USER_TRANSACTIONS);
            const saleCommodityQuantity = await AdminModelObj.getSaleAndPurchaseCommodity(salePurchaseCol, [1, 8]);
            const purchaseCommodityQuantity = await AdminModelObj.getSaleAndPurchaseCommodity();
            const result = await AdminModelObj.fetchCommodityProfit(tableConstants.USER_TRANSACTIONS);

            for (let i = 0; i < saleCommodityQuantity.length; i++) {
                const element = saleCommodityQuantity[i];

                const commodity_profit = await result.filter(function(result) {
                    return result.commodity_id == element.commodity_id;
                })

                saleCommodityQuantity[i].sale_commodity = await commonHelpers.formatAmount(saleCommodityQuantity[i].sale_commodity);

                element.purchase_commodity = await commonHelpers.formatAmount(purchaseCommodityQuantity[i].purchase_commodity);
                let commodity_profit_amount = 0;

                if(commodity_profit[0]!==undefined){
                    commodity_profit_amount= commodity_profit[0].profit;
                }
                
                element.commodity_profit = commodity_profit_amount;
                // element.profit = await commonHelpers.formatAmount(element.total);
            }
            // Return response.
            let returnData = {
                "userLength": userLength.length,
                "saleAndPurchaseCommodity": saleCommodityQuantity,
                "totalProfit": totalProfit
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