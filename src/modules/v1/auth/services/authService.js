import AuthModel from "../models/AuthModel";
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


const email = new Email();
const JwtAuthSecurityObj = new JwtAuthSecurity();
const AuthModelObj = new AuthModel();


const currentTime = DateTimeUtil.getCurrentTimeObjForDB();

/**
 * creating AuthModel object for access the database 
 */
export class authService {

    /**
     * Verify login services.
     * @param {*} req 
     * @returns 
     */
    async verifyLogin(req) {

        try{
        
            // Set where inserted email is.
            const where = {
                'email': req.body.email
            }
            // get detail from admin table using email id
            const getAdmin = await AuthModelObj.fetchObj(where, tableConstants.ADMIN);
            console.log("getAdmin---", getAdmin);
            // Check email is valid.
            if(getAdmin.length > 0){

                const where = {
                    'email': req.body.email,
                    'user_type': 1,
                    'is_deleted': 0,
                    'status': 1
                }
                
                // get admin hash password
                const encryptPassword = getAdmin[0].password;
        
                // Check password is matched or not.
                const matchedPassword = passwordHash.compareSync(req.body.password, encryptPassword)
        
                // Check if password is matched.
                if (matchedPassword == true) {//password match then set session and return response

                    const id = getAdmin[0].id; // Get user id.
                        req.session.adminId = id; // Set userId in session.
            
                    // Return true response.
                    let response = {
                        status: true,
                        status_code: StatusCodes.OK,
                        response: ('success')
                    };
                    return response;

                }else{//password not match set response

                    let response = {
                        status: false,
                        status_code: customResponseCode.NOT_MATCHED,
                        response: {}
                    };
                    return response;

                }
                
            } else {
                //return false response. 
                let response = {
                status: false,
                status_code: StatusCodes.ACCONUT_NOT_FOUND,
                response: {}
                };
                return response;
            }
   
        }    
        catch(error){

            return error;
        }
    }

}