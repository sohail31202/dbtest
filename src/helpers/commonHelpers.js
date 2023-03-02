import { random } from "lodash";
import commonConstants from '~/constants/commonConstants';
import DateTimeUtil from "~/utils/DateTimeUtil";
import { Buffer } from 'buffer';
/*
 *@get random number between 1000 to 9999
 *@return 4 digit Number
 */
const getOtp = function() {

    /*
     *@set minimum and maximum range 
     */
    const range = { min: 1000, max: 9999 },
        delta = range.max - range.min;
    /*
     *@get random number using math function
     */
    var randomNumber = Math.round(range.min + Math.random() * delta);

    return randomNumber;
}

/**
 * Function to produce UUID.
 */
const generateUUID = function() {
    var d = new Date().getTime();

    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now();
    }

    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    // console.log(uuid);
    return uuid;
}

// get random string according to requird length
const getRandomString = function(strLength, charSet) {
    var result = [];
    
    strLength = strLength || 5;
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    while (strLength--) { // (note, fixed typo)
        result.push(charSet.charAt(Math.floor(Math.random() * charSet.length)));
    }
    
    return result.join('');
}

const getUserImgPath = function(file_name,orignal = false){
    var picture='';
    var default_img = process.env.ASSETS_URL_BASE + commonConstants.USER_DEFAULT_IMAGE_PATH;
    if (file_name != '' && file_name != null) {
       
        var devEnvPath = '';
        if(process.env.NODE_ENV=='development'){
            devEnvPath= 'development/';
        }
        
        if(orignal){
            picture = process.env.SAFERR_IMG_URL + devEnvPath + commonConstants.SAFERR_USR_IMG_PATH + file_name; 
        }else{
            picture = process.env.SAFERR_IMG_URL + devEnvPath + commonConstants.SAFERR_USR_IMG_THUMB_PATH + file_name; 
        }

    }else{
        picture= default_img; 
    }
    return picture;
}

const getSaferrFormatDate = function(dateValue, showTime = false){
    if(dateValue=='' || dateValue==null) return '';
    if(showTime) return DateTimeUtil.changeFormat(dateValue, "DD/MM/YYYY hh:mm A");
    else return DateTimeUtil.changeFormat(dateValue, "DD/MM/YYYY");
}

const getValueDesc = function(value_code, ref_key){
    switch (ref_key) {
        case 'signup_type':
            if(value_code=='2'){
                return "Social";
            }else{
                return "Normal";
            }
        break;
        case 'social_type':
            //1:google, 2:facebook, 3:apple 
            if(value_code=='1'){
                return "Google";
            }else if(value_code=='2'){
                return "Facebook";
            }else if(value_code=='3'){
                return "Apple";
            }
        break;
    
        default:
            break;
    }
}

const base64Encode = function(data){
    const buf = Buffer.from(data.toString());
    let base64data = buf.toString('base64');
    return base64data;
}

const base64Decode = function(base64data){
    let buff = Buffer.from(base64data, 'base64');
    let text = buff.toString('ascii');
    return text;
}

function unEscape(htmlStr) {
    htmlStr = htmlStr.replace(/&lt;/g , "<");	 
    htmlStr = htmlStr.replace(/&gt;/g , ">");     
    htmlStr = htmlStr.replace(/&quot;/g , "\"");  
    htmlStr = htmlStr.replace(/&#39;/g , "\'");   
    htmlStr = htmlStr.replace(/&amp;/g , "&");
    return htmlStr;
}

 
function prepUserName(userDetail, picture_key_name = "picture", name_key_name = "fullname"){
	return `<img class="py-1" data-fancybox src="${userDetail[picture_key_name]}" alt="picture">` + " " + userDetail[name_key_name]
    
}

const roundNumber = function (value, roundDecimal) {
    var result = 0;
    switch (roundDecimal) {
        case 2:
            result = Math.round(value * 100) / 100;
            break;

        case 3:
            result = Math.round(value * 1000) / 1000;
            break;

        case 4:
            result = Math.round(value * 10000) / 10000;
            break;
    }
    return result;

}

const getTransactionMsg = (val, preparedTransMeta) => {
    
      var metadata = preparedTransMeta[val.transaction_type];
      const parsedMeta = JSON.parse(metadata.additional_data);

    var trans_msg = eval('`'+metadata.value_desc+'`');
    var trans_text = parsedMeta.transaction_type_text;
    // var transaction_icon = parsedMeta.transaction_icon;
     if (val.transaction_type == 2 && val.request_id) {
         trans_msg = trans_msg+' '+parsedMeta.additional_msg;
     }

     if (val.transaction_type == 3 && val.request_id) {
         trans_msg = trans_msg+' '+parsedMeta.additional_msg;
     }
     
     return {"title":trans_msg, "transaction_type_text":trans_text};

}
const commonHelpers = {
    getOtp,
    generateUUID,
    getRandomString,
    getUserImgPath,
    getSaferrFormatDate,
    getValueDesc,
    base64Encode,
    base64Decode,
    unEscape,
    prepUserName,
    roundNumber,
    getTransactionMsg
}

export default commonHelpers