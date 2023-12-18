import {
    shipmentService
} from '../services/shipmentService';
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
import i18n from "~/config/i18n.config";
import {
    LocaleService
} from "~/utils/localeService";
import DateTimeUtil from "~/utils/DateTimeUtil";
import shipmentModel from "../models/shipmentModel";
import commonConstants from '~/constants/commonConstants';


const currentYear = DateTimeUtil.getCurrentYear();
var localeService = new LocaleService(i18n);
const shipmentModelObj = new shipmentModel();
var shipmentServiceObj = new shipmentService();

/**
 * Get dashboard page function. 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getShipment = async (req, res, next) => {
    shipmentServiceObj.getShipment(req).then(async (returnData) => {
        const commodity = await shipmentModelObj.fetchCommodity();

        // prepare shipment type message
        const shipmentType = [{
            'type': commonConstants.TRANSTYPE_RECEIVE_PHYSICAL_COMMODITY,
            'message': commonConstants.APP_RECEIVE_COMMODITY_MESSAGE
        },
        {
            'type': commonConstants.TRANSTYPE_DELIVER_PHYSICAL_COMMODITY,
            'message': commonConstants.APP_DELIVER_COMMODITY_MESSAGE
        }];
        const shipmntStatus = [{
            'status': 1,
            'message': commonConstants.PENDING_ESTIMATE_STATUS_MESSAGE
        },
        {
            'status': 2,
            'message': commonConstants.SHIPPING_ESTIMATE_STATUS_MESSAGE
        },
        {
            'status': 3,
            'message': commonConstants.SHIPPING_CREATED_STATUS_MESSAGE
        }]

        const sStatus = await shipmentModelObj.fetchShipmentStatus();
        for (let index = 0; index < sStatus.length; index++) {
            const element = sStatus[index];

            let status = {
                'status': element.shipment_status,
                'message': element.shipment_status
            }
            shipmntStatus.push(status);
            console.log("status", status);
        }

        //For getting shipment page
        let data = {
            'title': 'Shipment',
            'currentYear': currentYear,
            "fetchData": returnData,
            "shipmentType": shipmentType,
            "shipmntStatus": shipmntStatus,
            "commodity": commodity
        };

        console.log('shipmentpage===', data)
        res.render('shipment.ejs', data);
    }).catch((err) => {
        console.log(err)
    })
}

/**
 * Get users
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const shipmentlist = (req, res, next) => {

    shipmentServiceObj.shipmentlist(req, res).then(async (returnData) => {
    })
}

const shipmentDetail = async (req, res, next) => {

    shipmentServiceObj.shipmentDetail(req).then((userData) => {
        let data = {
            'title': 'Shipment Detail',
            'currentYear': currentYear,
            "shipmentData": userData
        };
        res.render('shipmentDetail.ejs', data);
    })

}

const createShipment = async (req, res, next) => {

    shipmentServiceObj.createShipment(req).then((shipmentDetail) => {
        let data = {
            'title': 'Shipment create',
            'currentYear': currentYear,
            "shipmentDetail": shipmentDetail
        };
        res.render('shipmentCreate.ejs', data);
    })

}

const updateShipment = async (req, res, next) => {
    shipmentServiceObj.updateShipment(req).then((shipmentData) => {
        res.json(shipmentData);

    })
}

// export all functions
const shipmentController = {
    getShipment,
    shipmentlist,
    shipmentDetail,
    createShipment,
    updateShipment
    // deleteUser,
    // statusChanged,
    // userTransectionlist
}

export default shipmentController