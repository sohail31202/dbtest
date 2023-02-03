import BaseModel from '~/models/BaseModel'
import tableConstants from '~/constants/tableConstants';
import commonConstants from '~/constants/commonConstants';
import customResponseCode from '~/constants/customResponseCode';
import StatusCodes from "http-status-codes";


const baseModelObj = new BaseModel();

export class commonServices {

    /*
     *check valid user login after jwt token validate then check user with divice id 
     */
    async checkValidUserLogin(req) {
        try {
            // set condition for valid login.
            //when user login is based on divice specific then set divice id in condition
            let query = {
                'id': req.user.id,
                'device_id': req.headers["device_id"]
            }

            return baseModelObj.fetchFirstObj(query, tableConstants.CRAVE_USERS).then((isValid) => {
                // check if user not found with current divice set response for false
                if (isValid == undefined) {
                    return false;
                }
                // return true if user found
                return true;

            }).catch((error) => {

                return false;
            })

        } catch (error) {

            return false;
        }
    }

}