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
    "BUCKET_BASE_URL": "https://crave.sgp1.digitaloceanspaces.com", //used in email config file
    "BUCKET_IMAGE_FOLDER": "images", //used in email config file
    "UPLOAD_MAX_FILE_SIZE":10485760, //set 10MB (in bytes)
    "META_INTENTION": "profile_intention",
    "META_GENDER": "gender",
    "USER_DEFAULT_IMAGE_PATH" : "images/default_user.png",
    "SAFERR_USR_IMG_THUMB_PATH" : "profile_picture/thumb/",
    "SAFERR_USR_IMG_PATH" : "profile_picture/"
};
export default commonConstants;