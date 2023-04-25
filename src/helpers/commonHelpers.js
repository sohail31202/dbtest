import { random } from "lodash";
import commonConstants from '~/constants/commonConstants';
import DateTimeUtil from "~/utils/DateTimeUtil";
import { Buffer } from 'buffer';
import axios from 'axios';

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

const getValueDesc = function(value_code, ref_key){
    switch (ref_key) {
        case 'signup_type':
            if(value_code==commonConstants.SIGNUP_TYPE_SOCIAL){
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

 
function prepUserName(userDetail, picture_key_name = "profile_img", name_key_name = "fullname"){
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

const ucWords = (string) => {
    string=string.toLowerCase().replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
    });
    return string;
}

const getTransactionMsg = (val, preparedTransMeta) => {
    
      var metadata = preparedTransMeta[val.transaction_type];
      const parsedMeta = JSON.parse(metadata.additional_data);

    var trans_msg = eval('`'+metadata.value_desc+'`');
    var trans_text = parsedMeta.transaction_type_text.replace(/_/g," ");
    trans_text=ucWords(trans_text);
    
    // var transaction_icon = parsedMeta.transaction_icon;
     if (val.transaction_type == commonConstants.TRANSTYPE_SEND_COMMODITY && val.request_id) {
        trans_msg = eval('`'+parsedMeta.additional_msg+'`');
     }

     if (val.transaction_type == commonConstants.TRANSTYPE_RECEIVED_COMMODITY && val.request_id) {
        trans_msg = eval('`'+parsedMeta.additional_msg+'`');
     }

    if(val.transaction_commodity_amount != null){
        val.transaction_commodity_amount = replace_currency_to_symbol(val.transaction_commodity_amount);
    }

    if(val.transaction_cash!=null){
        val.transaction_cash = replace_currency_to_symbol(val.transaction_cash);
    }
    

     var transaction_ammount=0;
     switch (val.transaction_type) {
        case commonConstants.TRANSTYPE_ADD_COMMODITY:
            transaction_ammount = val.transaction_commodity_amount;
            break;
        case commonConstants.TRANSTYPE_SEND_COMMODITY:
            transaction_ammount = val.transaction_commodity_amount;
            break;
        case commonConstants.TRANSTYPE_RECEIVED_COMMODITY:
            transaction_ammount = val.transaction_commodity_amount;
            break;
        case commonConstants.TRANSTYPE_WITHDRAW_COMMODITY:
            transaction_ammount = val.transaction_commodity_amount;
            break;
        case commonConstants.TRANSTYPE_ADD_CASH:
            transaction_ammount = val.transaction_cash;
            break;
        case commonConstants.TRANSTYPE_WITHDRAW_CASH:
            transaction_ammount = val.transaction_cash;
            break;
        case commonConstants.TRANSTYPE_COMMODITY_TO_CASH:
            transaction_ammount = val.transaction_cash;
            break;
        case commonConstants.TRANSTYPE_RECEIVE_PHYSICAL_COMMODITY:
            transaction_ammount = val.transaction_quantity;
            break;
        case commonConstants.TRANSTYPE_DELIVER_PHYSICAL_COMMODITY:
            transaction_ammount = val.transaction_quantity;
            break;
        case commonConstants.TRANSTYPE_PAY_FOR_SHIPMENT:
            transaction_ammount = val.transaction_cash;
            break;
     }

     return {"title":trans_msg, "transaction_type_text":trans_text, "transaction_ammount": transaction_ammount};

}

const replace_currency_to_symbol = (amount_str) => {
    amount_str =amount_str.replace(/USD/gi, "$");
    amount_str =amount_str.replace(/EUR/gi, "€");
    amount_str =amount_str.replace(/CAD/gi, "C$");
    return amount_str;
}

const formatAmount = (amount, roundDigit = commonConstants.ROUND_DIGIT_WEIGHT) => {
    return Number( amount ).toLocaleString("en-US", {minimumFractionDigits: roundDigit, maximumFractionDigits: roundDigit })
}

const sendNotification = (dataParams) => {
    return axios.post(`${process.env.API_URL}/notification/send`, dataParams).then( ( result ) => {

        return { "status": true, "data": result.data };
    }).catch( (error) => {
        console.log("Error creating rates", error);
        
        return { "status": false, "data": error };
    } );
}

const commonHelpers = {
    getOtp,
    generateUUID,
    getRandomString,
    getValueDesc,
    base64Encode,
    base64Decode,
    unEscape,
    prepUserName,
    roundNumber,
    getTransactionMsg,
    formatAmount,
    replace_currency_to_symbol,
    sendNotification
}

export default commonHelpers