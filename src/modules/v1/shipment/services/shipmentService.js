import shipmentModel from "../models/shipmentModel";
import tableConstants from '~/constants/tableConstants';
import commonConstants from '~/constants/commonConstants';
import logger from "~/utils/logger";
import {
    StatusCodes
} from "http-status-codes";
import commonHelpers from '~/helpers/commonHelpers'
import DateTimeUtil from "~/utils/DateTimeUtil";

import Shipengine from "~/libraries/Shipengine";
const ShipengineObj = new Shipengine();

const shipmentModelObj = new shipmentModel(),
    S3BasePath = process.env.S3_BASE_PATH,
    imgDirectory = commonConstants.IMAGE_FOLDER,
    s3CommoityImgPath = `${S3BasePath}${imgDirectory}/`;

/**
 * creating shipmentModel object for access the database 
 */
export class shipmentService {

    /**
     * Get dashboard page services.
     * @param {*} req 
     * @returns 
     */
    async getShipment(req, res) {
        try {
            return true
        } catch (error) {
            console.log(error);
            // logger.error(error);
            return error;
        }
    }

    /**
     * Get shipment list
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async shipmentlist(req, res) {
        try {
            var draw = req.body.draw;

            var start = req.body.start;

            var length = req.body.length;

            var order_data = req.body['order[0][column]'];
            var order = req.body['order[0][dir]']

            // search data
            var search = req.body.search;

            if (search != '' && search != undefined) {

                var search_value = search.value.trim();

                var search_query = `
                    ( shipment_type LIKE '%${search_value}%')
                    `;
            }
            else {
                var search_query = '';
            }
            //Total number of records without filtering
            var total_records = await shipmentModelObj.getTotalCount();
            //Total number of records with filtering
            const records = await shipmentModelObj.getShipmentTotalCount(search_query, start, length);
            var total_records_with_filter = records.length;
            const shipmentData = await shipmentModelObj.getShipmentData(search_query, start, length, order_data, order);

            shipmentData.forEach(async (element, index) => {
                shipmentData[index].s_no = index + 1 + Number(start);

                // Here we are encoding id
                const encId = commonHelpers.base64Encode(element.id)

                // Here we are changing date format
                const changeFormat = DateTimeUtil.changeFormat(element.created_at, "DD/MM/YYYY");
                element.created_at = changeFormat;
                // parsing JSON addressData
                const addressData = JSON.parse(element.address_json);
                element.id = encId;

                // prepare address data & contact detail
                if (!addressData) {
                    element.address = "N/A";
                    element.contact_detail = "N/A"
                } else {
                    element.address = (addressData.address_line1 + ' ' + addressData.city_locality + ' ' + addressData.state_province + ' ' + addressData.country_code + ' ' + addressData.postal_code);

                    element.contact_detail = (addressData.name + ' ' + addressData.phone);
                }

                // To replace currency name by currency symbol
                if (element.shipment_charge != null) {
                    element.shipment_charge = commonHelpers.replace_currency_to_symbol(element.shipment_charge);
                }

                // when status 1 & shipment type 8
                if (element.status == 1 && element.shipment_type == commonConstants.TRANSTYPE_RECEIVE_PHYSICAL_COMMODITY) {
                    element.action = `<a href="create-shipment/${encId}" class="btn btn-success btn-rounded btn-icon"><i class="ti-eye" title="Detail" aria-hidden="true"></i></a>`
                }

                // when status 2 & shipment type 8 or when status 3 & shipment type 9
                if (element.status == 2 && element.shipment_type == commonConstants.TRANSTYPE_RECEIVE_PHYSICAL_COMMODITY || element.status == 3 && element.shipment_type == commonConstants.TRANSTYPE_DELIVER_PHYSICAL_COMMODITY) {
                    element.action = `<a href="shipping-detail/${encId}" class="btn btn-success btn-rounded btn-icon"><i class="ti-eye" title="Detail" aria-hidden="true"></i></a>`
                }

                // when status 3 & shipment type 8
                if (element.status == 3 && element.shipment_type == commonConstants.TRANSTYPE_RECEIVE_PHYSICAL_COMMODITY) {
                    element.action = `<a href="shipping-detail/${encId}" class="btn btn-success btn-rounded btn-icon"><i class="ti-eye" title="Detail" aria-hidden="true"></i></a>`
                }

                // when status 3 & shipment type 9
                // if(element.status == 3 && element.shipment_type == commonConstants.TRANSTYPE_DELIVER_PHYSICAL_COMMODITY){
                //     element.action = `<a href="shipping-detail/${encId}" class="btn btn-success btn-rounded btn-icon"><i class="ti-eye" title="Detail" aria-hidden="true"></i></a>`
                //     }


                // prepare shipment type message
                if (element.shipment_type == commonConstants.TRANSTYPE_RECEIVE_PHYSICAL_COMMODITY) {
                    element.shipment_type = commonConstants.APP_RECEIVE_COMMODITY_MESSAGE
                }
                if (element.shipment_type == commonConstants.TRANSTYPE_DELIVER_PHYSICAL_COMMODITY) {
                    element.shipment_type = commonConstants.APP_DELIVER_COMMODITY_MESSAGE
                }

                // prepare status messages
                if (!element.shipment_status) {
                    element.shipment_status = "N/A";
                }
                if (element.status == 1) {
                    element.status = commonConstants.PENDING_ESTIMATE_STATUS_MESSAGE;
                }
                if (element.status == 2) {
                    element.status = commonConstants.SHIPPING_ESTIMATE_STATUS_MESSAGE;
                }
                if (element.status == 3) {
                    element.status = commonConstants.SHIPPING_CREATED_STATUS_MESSAGE;
                }

            });
            var output = {
                'draw': draw,
                'iTotalRecords': total_records,
                'iTotalDisplayRecords': total_records_with_filter,
                'aaData': shipmentData,
            };
            res.json(output);
        } catch (error) {
            console.log(error);
            logger.error(error);
            return error;
        }
    }

    async shipmentDetail(req, res) {
        try {
            const encIds = commonHelpers.base64Decode(req.params.shipmentId);
            const where = { "user_shipments.id": encIds };
            const shipmentData = await shipmentModelObj.fetchShipmentDetail(where, tableConstants.USER_SHIPMENTS);
            if (shipmentData.shipment_charge != null) {
                shipmentData.shipment_charge = commonHelpers.replace_currency_to_symbol(shipmentData.shipment_charge);
            }
            if (shipmentData.admin_brokerage != null) {
                shipmentData.admin_brokerage = commonHelpers.replace_currency_to_symbol(shipmentData.admin_brokerage);
            }
            if (shipmentData.processing_fee != null) {
                shipmentData.processing_fee = commonHelpers.replace_currency_to_symbol(shipmentData.processing_fee);
            }
            if (shipmentData.total_amount != null) {
                shipmentData.total_amount = commonHelpers.replace_currency_to_symbol(shipmentData.total_amount);
            }
            if (shipmentData.payment_method == 1) {
                shipmentData.payment_method = "Card"
            }
            if (shipmentData.payment_method == 2) {
                shipmentData.payment_method = "Vault"
            }

            const packageWeight = JSON.parse(shipmentData.pkg_weight);
            shipmentData.pkg_weight = (packageWeight.value + ' ' + packageWeight.unit)

            const packageDimension = JSON.parse(shipmentData.pkg_dimensions);
            shipmentData.packageUnit = packageDimension.unit
            shipmentData.packageLength = packageDimension.length
            shipmentData.packageWidth = packageDimension.width
            shipmentData.packageHeight = packageDimension.height

            const changeFormat = DateTimeUtil.changeFormat(shipmentData.created_at, "DD/MM/YYYY");
            shipmentData.created_at = changeFormat;
            
            return shipmentData;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async createShipment(req, res){
        try {

            const encId = commonHelpers.base64Decode(req.params.shipmentId);
            const where = { "user_shipments.id": encId };
            const shipmentDetail = await shipmentModelObj.fetchShipmentDetail(where, tableConstants.USER_SHIPMENTS);
            if (!shipmentDetail.address_json) {
                shipmentDetail.address = "N/A";
                shipmentDetail.city = "N/A";
                shipmentDetail.state = "N/A";
                shipmentDetail.pin_code = "N/A";
            }else {
                const addressData = JSON.parse(shipmentDetail.address_json);
                shipmentDetail.address = (addressData.address_line1);
                shipmentDetail.city = (addressData.city_locality);
                shipmentDetail.state = (addressData.state_province);
                shipmentDetail.pin_code = (addressData.postal_code);
            }
            
            shipmentDetail.id = req.params.shipmentId;
            return shipmentDetail;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async updateShipment(req, res){
        try {
           
            // req.params.id = req.params.id);
            const bodyData = req.body,
            rateId = commonHelpers.base64Decode( bodyData.rate_id ),
            contentDescription = "Receive commodity from GOLDAPP",
            length = bodyData.p_length,
            width = bodyData.p_width,
            height = bodyData.p_height,
            value = bodyData.p_weight,
            packagedimension = {
                "unit":"inch",
                "length":length,
                "width":width,
                "height":height
            },
            gold_app_address = {
                "company_name": "Gold App",
                "name": "Gold Admin",
                "phone": "111-111-1111",
                "address_line1": "4009 Marathon Blvd",
                "address_line2": "Suite 300",
                "city_locality": "Austin",
                "state_province": "TX",
                "postal_code": "78756",
                "country_code": "US",
                "address_residential_indicator": "no"
            },
            where = { "id": rateId };
            const userShipmentData = await shipmentModelObj.fetchFirstObj(where, tableConstants.USER_SHIPMENTS);
            
            const commodityId = userShipmentData.commodity_id;
            const commodityData = await shipmentModelObj.fetchFirstObj({"id": commodityId}, tableConstants.COMMODITIES);
            
            let quantityUnit = userShipmentData.quantity_unit,
                quantity = userShipmentData.quantity;
            const commodityAmount = userShipmentData.commodity_amount,
                packageWeight = {
                    "value":value,
                    "unit":"gram"
                };
              
            // calculate amount according weight unit in usd.
            if (quantityUnit == "grain") {
                // Convert commodity weight grain to gram
                quantity = await commonHelpers.weightUnitConversion(quantityUnit, quantity);
                // Change commodity unit grain to gram
                quantityUnit = "gram";
            } 

            const shipment = {
                "validate_address": "no_validation",
                "ship_to": JSON.parse(userShipmentData.address_json),
                "ship_from": gold_app_address,
                "customs": {
                    "non_delivery": "return_to_sender",
                    "contents": "merchandise",
                    "customs_items": [
                        {
                            "description": commodityData.name,
                            "quantity": 1,
                            "value": {
                                "amount": commodityAmount, // 580
                                "currency": "USD" // "USD"
                            },
                            "weight": {
                                "value": quantity, // 10
                                "unit": quantityUnit == "oz" ? "ounce": quantityUnit // "gram"
                            }
                        }
                    ]
                },
                "packages": [
                    {
                        "weight": packageWeight,
                        "dimensions": packagedimension,
                        "content_description": contentDescription,
                        "external_package_id": commodityId
                    }
                ]
            };
            
            const shippingRates = await ShipengineObj.fetchShippingRates(shipment);
                console.log("shippingRates.data----------------->", shippingRates);
                // Check request data
                if (shippingRates.status == false) {
                    return {
                        "status": "Failed",
                        "message": shippingRates.data.response.data.errors[0].message
                    }
                }

                if( shippingRates.data.rate_response.rates.length < 1 ) {
                    return {
                        "status": "Failed",
                        "message": shippingRates.data.rate_response.errors[0].message
                    }
                }
               
                const shipmentCharge = await commonHelpers.roundNumber( shippingRates.data.rate_response.rates[0].shipping_amount.amount + shippingRates.data.rate_response.rates[0].insurance_amount.amount + shippingRates.data.rate_response.rates[0].confirmation_amount.amount + shippingRates.data.rate_response.rates[0].other_amount.amount, commonConstants.ROUND_DIGIT );
                
                const updateUserShipment = {
                    "pkg_dimensions":JSON.stringify(packagedimension),
                    "pkg_weight":JSON.stringify(packageWeight),
                    "shipment_charge": shipmentCharge,
                    "status":2
                };
            await shipmentModelObj.updateObj(updateUserShipment, where, tableConstants.USER_SHIPMENTS);
            
            const notificationData = {
                "sender_id": req.session.adminId,
                "rate_id": bodyData.rate_id,
                "receiver_id": userShipmentData.user_id,
                "notification_type": "shipment_estimated",
                "additional_data": ""
            };

            const notifyData = await commonHelpers.sendNotification( notificationData );
            console.log("notifyData-", notifyData );
            
            return {
                "status": "success",
                "message": "Rate fatched successfully",
                "id": bodyData.rate_id
            }
        } catch (error) {
            console.log(error);
            return error;

        }
    }
}