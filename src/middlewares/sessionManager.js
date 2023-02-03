import tableConstants from "~/constants/tableConstants";
import BaseModel from "~/models/BaseModel";

const BaseModelObj = new BaseModel();

const sessionServices = async (req, res, next) => {
console.log("req.session.adminId---", req.session.adminId);
    if( !req.session.adminId || req.session.adminId == '') {
        req.session.destroy();
        res.redirect('/');
        
        return false;
    }  

    // check admin exist or not
    let isAdminExist = await BaseModelObj.fetchObj({'id':req.session.adminId}, tableConstants.ADMIN );
    
    // if not exist then destroy  session and redirect to login page
    if(isAdminExist.length == 0) {

        req.session.destroy();
        res.redirect('/');
    }

    next();
}

module.exports = sessionServices;