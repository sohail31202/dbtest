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

const currentYear = DateTimeUtil.getCurrentYear();
var localeService = new LocaleService(i18n);
var shipmentServiceObj = new shipmentService();

/**
 * Get dashboard page function. 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getShipment = async (req, res, next) => {
    shipmentServiceObj.getShipment(req).then(async (returnData) => {
        //For getting shipment page
        let data = {
            'title': 'Shipment',
            'currentYear': currentYear,
            "fetchData": returnData
        };
        res.render('shipment.ejs', data);
    })
}

/**
 * Get users
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const shipmentlist  = (req, res, next) => {

    shipmentServiceObj.shipmentlist(req, res).then((returnData) => {
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
    console.log("you are in update shipment");
    shipmentServiceObj.updateShipment(req).then((shipmentData) =>{
        let data = {
            'title': 'Update shipment',
            'currentYear': currentYear
        }
        
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