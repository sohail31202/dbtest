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
import { shipmentService } from '../../shipment/services/shipmentService';
import shipmentModel from '../../shipment/models/shipmentModel';
import commonConstants from '~/constants/commonConstants';
import tableConstants from '~/constants/tableConstants'
const currentYear = DateTimeUtil.getCurrentYear();
var localeService = new LocaleService(i18n);
var adminServiceObj = new adminService();

const shipmentModelObj = new shipmentModel(),
    S3BasePath = process.env.S3_BASE_PATH,
    imgDirectory = commonConstants.IMAGE_FOLDER,
    s3CommoityImgPath = `${S3BasePath}${imgDirectory}/`;
var shipmentServiceObj = new shipmentService();
/**
 * Get dashboard page function. 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
*/
const getDashboard = async (req, res, next) => {
    //shipment type 8 means ship to user and shipment type 9 means ship to gold app admin
    // status 0: Temporary data, 1: Requested by user, 2: Proceed by admin, 3: Shipment created
    let vall = await Promise.all(["gold", "rhodium", "silver", "platinum", "palladium"].map(async (name, ind) => {
        let where = { "user_shipments.commodity_id": 1 + ind };
        let shipmentData = await shipmentModelObj.fetchShipmentDetails(where, tableConstants.USER_SHIPMENTS);
        let quantityToBeShipped = shipmentData?.filter(data => data.shipment_type == 8)?.map(data => data.quantity)?.reduce((total, num) => total + num, 0)
        let quantityReceived = shipmentData?.filter(data => data.shipment_type == 9)?.map(data => data.quantity)?.reduce((total, num) => total + num, 0)
        return {
            commodity: name,
            quantityToBeShipped,
            quantityReceived
        }
    }))



    adminServiceObj.getDashboard(req, res).then((returnData) => {

        const colorArr = ["card-light-megenta", "card-light-danger", "card-light-blue", "card-light-pink", "card-light-megenta", "card-dark-blue", "card-light-danger", "card-light-blue", "card-light-pink", "card-dark-blue"]

        // Return data into dashboard page.
        let data = {
            'title': 'Dashboard',
            'currentYear': currentYear,
            'intentLength': 0,
            "userLength": returnData.response.userLength,
            "totalProfit": returnData.response.totalProfit,
            "saleAndPurchaseCommodities": returnData.response.saleAndPurchaseCommodity,
            "reportedUserLength": 0,
            "colorArr": colorArr,
            "shippingData": vall
        };
        res.render('dashboard.ejs', data);
    })
}



// export all functions
const adminController = {

    getDashboard,

}

export default adminController