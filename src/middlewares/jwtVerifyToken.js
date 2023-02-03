import Jwt from "jsonwebtoken";
import i18n from "~/config/i18n.config";
import { LocaleService } from "~/utils/localeService";
import { commonServices } from "~/services/commonServices"
const localeService = new LocaleService(i18n);
const commonServceObj = new commonServices();

const jwtVerifyToken = async(req, res, next) => {
    /* get jwt to secret key from env file*/
    const secretKey = process.env.JWT_SECRET_KEY;
    /*get jwt token from requet*/
    const token =
        req.body.token || req.query.token || req.headers["access_token"];

    /*set error message when token key not found*/
    if (!token) {
        const responseObj = {
            "status": "fail",
            "status_code": 403,
            "message": localeService.translate('ACCESS_TOKEN_REQUIRED'),
            "data": ''
        };
        return res.status(403).json(responseObj);
    }

    try {
        /*verify token and add user key in response */
        const decoded = Jwt.verify(token, secretKey);

        // check divice specific check if header divice id and token divice id not match then set invalid token
        if (decoded.device_id != req.headers["device_id"]) {
            const responseObj = {
                "status": "fail",
                "status_code": 401,
                "message": localeService.translate('INVALID_TOKEN'),
                "data": ''
            };
            return res.status(401).json(responseObj);
        }
        // set user data in request data
        req.user = decoded;
        // check user login with current divice id 
        const isValid = await commonServceObj.checkValidUserLogin(req);
        // if user not login wih current divice id res response for invalid token
        if (isValid == false) {

            const responseObj = {
                "status": "fail",
                "status_code": 401,
                "message": localeService.translate('INVALID_TOKEN'),
                "data": ''
            };
            return res.status(401).json(responseObj);
        }
    } catch (err) {
        /*return error message when token not valid  */
        const responseObj = {
            "status": "fail",
            "status_code": 401,
            "message": localeService.translate('INVALID_TOKEN'),
            "data": ''
        };
        return res.status(401).json(responseObj);
    }

    return next();
};

module.exports = jwtVerifyToken;