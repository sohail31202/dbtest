/**
 * Common Constants
 *
 * @package                
 * @subpackage             Common Constants
 * @category               Constants
 * @ShortDescription       This is responsible for common constants
 */
const commonConstants = {
    "FILE_UPLOAD_STORAGE_TYPE": "cloud", //used in file upload library local or cloud(AWS etc.)
    "IS_FILE_UPLOAD_CLOUD": "true", //used in file upload library local or cloud(AWS etc.)
    "STORAGE_PATH": "./uploads/",
    "STORAGE_FOLDER": "uploads",
    "AVATAR_FIELD": "avatar",
    "AVATAR_FOLDER": "avatars",
    "DB_DATE_FORMAT": "YYYY-MM-DD HH:mm:ss", //used in dateTime library
    "EMAIL_TEMPLATE_URL": "./src/emails/", //used in email config file
    "OTP_EMAIL_LIMIT": "3",
    "OTP_VALID_HOURS": "24",
    "OTP_LIMIT_REFRESH_IN_HOURS": "24",
    "PASSWORD_SALT_ROUNDS": 10,
    "PROFILE_STEP_ONE": 1,
    "PROFILE_STEP_TWO": 2,
    "SIGNUP_TYPE_NORMAL": 1,
    "SIGNUP_TYPE_SOCIAL": 2,
    "INACTIVE_STATUS": 0,
    "ACTIVE_STATUS": 1,
    "DIVICE_TYPE_ANDROID": 1,
    "DIVICE_TYPE_IOS": 2,
    "DIVICE_TYPE_WEBSITE": 3,
    "IMAGE_FOLDER":"img",
    "UPLOAD_MAX_FILE_SIZE":10485760, //set 10MB (in bytes),
    "TRANSTYPE_ADD_COMMODITY":1,
    "TRANSTYPE_SEND_COMMODITY":2,
    "TRANSTYPE_RECEIVED_COMMODITY":3,
    "TRANSTYPE_WITHDRAW_COMMODITY":4,
    "TRANSTYPE_ADD_CASH":5,
    "TRANSTYPE_WITHDRAW_CASH":6,
    "TRANSTYPE_COMMODITY_TO_CASH":7,
    "TRANSTYPE_RECEIVE_PHYSICAL_COMMODITY":8,
    "TRANSTYPE_DELIVER_PHYSICAL_COMMODITY":9,
    "TRANSTYPE_PAY_FOR_SHIPMENT":10,
    "ROUND_DIGIT_WEIGHT":4,
    "ROUND_DIGIT":2,
    
};
export default commonConstants;