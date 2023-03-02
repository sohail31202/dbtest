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
import i18n from "~/config/i18n.config";
import {
    LocaleService
} from "~/utils/localeService";

var localeService = new LocaleService(i18n);
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

    async feeSetting(req, res, next) {
        const whereUsd = {
                "currency": "USD"
            },
            whereEur = {
                "currency": "EUR"
            },
            whereCad = {
                "currency": "CAD"
            },
            columns = [
                "fee_flat",
                "fee_percent"
            ];

        return SettingModelObj.fetchObjWithSingleRecord(whereUsd, columns).then((usdData) => {
            return SettingModelObj.fetchObjWithSingleRecord(whereEur, columns).then(async (eurData) => {
                return SettingModelObj.fetchObjWithSingleRecord(whereCad, columns).then(async (cadData) => {
                
                    // Set response
                    return {
                        "usd": usdData,
                        "cad": cadData,
                        "eur": eurData 
                    };
                }).catch((error) => {
                    return error;
                });
            }).catch((error) => {
                return error;
            });
        }).catch((error) => {
            return error;
        });
    };

    /**
    * Update payment gateway fees.
    * @param {*} req 
    * @returns 
    */
    async updateGatewayFee(req) {
        const currentTime = DateTimeUtil.getCurrentTimeObjForDB(),
            adminId = req.session.adminId,
            requestData = req.body,
            whereUsd = {
                "currency": "USD"
            },
            whereEur = {
                "currency": "EUR"
            },
            whereCad = {
                "currency": "CAD"
            },
            updateFeeUSD = {
                "fee_percent": requestData.feeUsd,
                "fee_flat": requestData.flatUsd,
                "updated_at": currentTime
            },
            updateFeeEUR = {
                "fee_percent": requestData.feeEuro,
                "fee_flat": requestData.flatEuro,
                "updated_at": currentTime
            },
            updateFeeCAD = {
                "fee_percent": requestData.feeCad,
                "fee_flat": requestData.flatCad,
                "updated_at": currentTime
            },
            response = {
                "status_code": StatusCodes.OK,
                "message": localeService.translate('FEE_UPDATED'),
                "data": ""
            };
            
        return SettingModelObj.updateObj(updateFeeUSD, whereUsd).then( (updateUsd) => {
            return SettingModelObj.updateObj(updateFeeEUR, whereEur).then( (updateEur) => {
                return SettingModelObj.updateObj(updateFeeCAD, whereCad).then( (updateCad) => {
            
                    return response;
                }).catch((error) => {
                    throw error
                });
            }).catch((error) => {
                throw error
            });
        }).catch((error) => {
            throw error
        });
    }

}