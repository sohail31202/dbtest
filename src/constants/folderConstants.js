import commonConstants from '~/constants/commonConstants';

/**
 * Common Constants
 *
 * @package                Mindiii
 * @subpackage             Folder Constants
 * @category               Constants
 * @ShortDescription       This is responsible for folder constants
 */

let storageFolder = "";

const basePath = process.env.ASSETS_URL_BASE,
    uploadPath=commonConstants.STORAGE_FOLDER,
    fileStaticPath = commonConstants.FILE_STATIC_PATH,
    adminBasePath =process.env.ADMIN_BASE_URL;

const folderConstants = {
    
    "UPLOAD_THUMB_FOLDER": "/thumb",

    // Image placeholder path
    "DEFAULT_IMAGE_PLACEHOLDER": `${basePath}/public/placeholder/image_placeholder.png`,

    //user profile path
    "PROFILE_MEDIA": `profile_picture`


};

export default folderConstants;