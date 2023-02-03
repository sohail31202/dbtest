import BaseModel from '~/models/BaseModel'
import tableConstants from '~/constants/tableConstants'
import commonConstants from '~/constants/commonConstants'
import knexJs from "knex";
import knexConfig from "~/config/knexfile";
const knex = knexJs(knexConfig);
const baseModelObj = new BaseModel();


export default class AuthModel extends BaseModel {


    /*
    * save otp code into verification
    @insertData  required field data array
    */
    insertOtpDetail = async(insertData) => {

        try {
            // insert data using basemodel create method
            const returnData = await this.createObj(insertData, tableConstants.CRAVE_EMAIL_VARIFICATION_CODE)
            return returnData;

        } catch (error) {

            return error;
        }
    }

    /*
    * check email exist  with otp in table
    @query  where condition
    @currentTime  current server date time
    */
    isExist = async(query, currentTime = '') => {

        try {
            let select = `*,TIMESTAMPDIFF(HOUR,updated_at,'${currentTime}') as LastSendHour`
            return knex(tableConstants.CRAVE_EMAIL_VARIFICATION_CODE)
                .select(knex.raw(select))
                .where(query)
                .first();
        } catch (error) {

            return error;
        }

    }

    /*
    * get email detail 
    @query  where condition
    @currentTime  current server date time
    */
    otpVerification = (query, currentTime = '') => {

        try {
            let select = `*,TIMESTAMPDIFF(HOUR,updated_at,'${currentTime}') as LastSendHour`
            return knex(tableConstants.CRAVE_EMAIL_VARIFICATION_CODE)
                .select(knex.raw(select))
                .where(query)
                .having('LastSendHour', '<=', commonConstants.OTP_VALID_HOURS)
                .first();

        } catch (error) {

            return error;
        }
    }

    /*
    * update detail data
    @properties  updated data
    @query  where codition
    @tableName table name
    */

    updateObj = (properties, query, tableName = '') => {

        return knex(tableName)
            .update(properties)
            .where(query)
            .then((res) => {
                return res;
            });
    }

    /*
    * save new user 
    @insertData  user detail object data
    */
    createUser = async(insertData) => {

        try {
            const returnData = await this.createObj(insertData, tableConstants.CRAVE_USERS)
            return returnData;

        } catch (error) {

            return error;
        }
    }

    /*
    * get user detail 
    @query  where condition
    */
    getUserDetail = (query) => {

        let select = `id,email,username,profile_step,profile_type,is_crave_plus,status`;
        return knex(tableConstants.CRAVE_USERS)
            .select(knex.raw(select))
            .where(query)
            .first();
    }

    /*
    * check is email used 
    @query  where condition
    */
    checkIsEmailUsed = (query) => {
        return knex(tableConstants.CRAVE_USERS)
            .select('*')
            .where(query)
            .first();
    }

    /*
    update user header data 
    @query  where condition
    @orQuery  or where condition
    @data  updated value 
    */
    updateHeader = (data, query, orQuery, tableName = tableConstants.CRAVE_USERS) => {

        return knex(tableName)
            .update(data)
            .where(query)
            .orWhere(orQuery)
            .then((res) => {
                return res;
            });
    }


    /*
     * export all function
     */
}