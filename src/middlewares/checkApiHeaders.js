import commonConstants from '~/constants/commonConstants'
import i18n from "~/config/i18n.config";
import { LocaleService } from "~/utils/localeService";
var localeService = new LocaleService(i18n);


/**
 * User authentication.
 *
 * @param  {Object} req Request.
 * @param  {Object} res Response.
 * @param  {Object} next Next request.
 */
const checkApiHeaders = (req, res, next) => {

    // Variable declaration
    const deviceId = req.headers["device_id"],
        deviceType = parseInt(req.headers["device_type"]),
        deviceToken = req.headers["device_token"],
        apiAccessKey = req.headers["api_key"];


    // check header
    if (deviceToken === "" || deviceToken === undefined || deviceId === undefined || deviceId === "" || deviceType === undefined || deviceType === "" || apiAccessKey === undefined || apiAccessKey === "") {
        const responseObj = { "status": "fail", "status_code": 400, "message": localeService.translate('MISSING_HEADERS'), "data": "" };
        return res.status(400).json(responseObj);
    }

    // Check device type
    if (deviceType !== commonConstants.DIVICE_TYPE_ANDROID && deviceType !== commonConstants.DIVICE_TYPE_IOS && deviceType !== commonConstants.DIVICE_TYPE_WEBSITE) {

        const responseObj = { "status": "fail", "status_code": 400, "message": localeService.translate('INVALID_DIVICE_TYPE'), "data": "" };
        return res.status(400).json(responseObj);
    }

    // check api access key
    if (process.env.API_KEY != apiAccessKey) {
        const responseObj = { "status": "fail", "status_code": 401, "message": localeService.translate('INVALID_API_KEY'), "data": "" };
        return res.status(401).json(responseObj);
    }

    next();

};

module.exports = checkApiHeaders;