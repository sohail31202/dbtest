import userModel from "../models/userModel";
import tableConstants from '~/constants/tableConstants';
import commonConstants from '~/constants/commonConstants';
import envConstants from "~/constants/envConstants";
import folderConstants from "~/constants/folderConstants";
import customResponseCode from '~/constants/customResponseCode';
import {
    StatusCodes
} from "http-status-codes";
import commonHelpers from '~/helpers/commonHelpers'
import DateTimeUtil from "~/utils/DateTimeUtil";
import passwordHash from "~/utils/passwordHash";
import Email from "~/libraries/Email";
import JwtAuthSecurity from "~/libraries/JwtAuthSecurity";



const userModelObj = new userModel(),
    S3BasePath = process.env.S3_BASE_PATH,
    imgDirectory = commonConstants.IMAGE_FOLDER,
    s3CommoityImgPath = `${S3BasePath}${imgDirectory}/`;




/**
 * creating userModel object for access the database 
 */
export class userService {

    /**
     * Get dashboard page services.
     * @param {*} req 
     * @returns 
     */
    async getUser(req, res) {

        try {

            return true
        } catch (error) {
            // console.log(error);
            logger.error(error);
            return error;

        }
    }

    /**
     * Get users list
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async userlist(req, res) {
        try {
            var draw = req.body.draw;

            var start = req.body.start;

            var length = req.body.length;

            var order_data = req.body['order[0][column]'];
            var order = req.body['order[0][dir]']

            // search data
            var search = req.body.search;

            if (search != '' && search != undefined) {

                var search_value = search.value.trim();

                var search_query = `
                    ( fullname LIKE '%${search_value}%' OR 
                    email LIKE '%${search_value}%' OR
                    phone_number LIKE '%${search_value}%' )
                    `;
            }
            else {
                var search_query = '';
            }
            //Total number of records without filtering
            var total_records = await userModelObj.getTotalCount();
            //Total number of records with filtering
            const records = await userModelObj.getUserTotalCount(search_query, start, length);
            var total_records_with_filter = records.length;
            const userData = await userModelObj.getuserData(search_query, start, length, order_data, order);

            userData.forEach(async (element, index) => {
                userData[index].s_no = index + 1 + Number(start)
                const statusIs = element.status == 1 ? 'Inactivate' : 'Activate';

                const statusIconText = element.status == 1 ? 'Inactive' : 'Active';
                const statusIsIcon = element.status == 1 ? '<i class="fa fa-ban mx-2" aria-hidden="true"></i>' : '<i class="fa fa-check-circle mx-2" aria-hidden="true"></i>';
                var deletedData = element.deleted_data_json;
                let Action, status;
                if (element.is_deleted == 1) {
                    deletedData = JSON.parse(deletedData);

                    deletedData.deleted_at = DateTimeUtil.changeFormat(element.deleted_at, "DD/MM/YYYY hh:mm A");
                    deletedData = JSON.stringify(deletedData);
                    Action = `<a href="#" data-toggle="modal" data-target="#deletedUserInfoModal" class="btn btn-warning btn-rounded btn-icon" onclick='showInfo(${deletedData})'><i class="fa fa-info mx-2" aria-hidden="true"></i></a>`;
                    status = '<span class="badge badge-danger" aria-hidden="true">Deleted</span>'
                } else {

                    Action = ` <a href="#" data-toggle="modal" data-target="#deleteModal" title="Delete" class="btn btn-danger btn-rounded btn-icon" onclick="deleteId('${element.id}')"><i
                    class="ti-trash" aria-hidden="true"></i></a>

                        <a href="#" data-toggle="modal" data-target="#changeStatusModal" title="${statusIconText}" class='btn btn-info btn-rounded btn-icon' onclick="changeStatus('${element.id}','${statusIs}')">${statusIsIcon}</a>

                        <!-- User Details button. -->
                        <a href="user-detail/${element.id}"  class="btn btn-success btn-rounded btn-icon"><i class="ti-eye" title="Detail" aria-hidden="true"></i></a>
                    </div>`;

                    status = element.status == 1 ? '<span class="badge badge-success" aria-hidden="true">Active</span>'
                        : '<span class="badge badge-warning" aria-hidden="true">Inactive</span>'
                }
                element.statusName = status;

                element.action = `<form action="/status-changed" method="post">
                    <td class="change-cls">
                        ${Action}
                    </td>
                </form>`
            });

            var output = {
                'draw': draw,
                'iTotalRecords': total_records,
                'iTotalDisplayRecords': total_records_with_filter,
                'aaData': userData,
            };
            res.json(output);
        } catch (error) {
            // console.log(error);
            logger.error(error);
            return error;
        }
    }

    /**
     * Delete user
     * @param {*} request 
     * @returns 
     */
    async deleteUser(request) {
        try {
            // Set a where condition
            const whereId = {
                'id': request.body.id
            },
                currentTime = DateTimeUtil.getCurrentTimeObjForDB(),

                column = ['fullname', 'email', 'phone_dial_code', 'phone_number'],
                getValue = await userModelObj.fetchObjWithSingleRecord(whereId, column, tableConstants.USERS);

            getValue.deleted_by = "admin";
            const updateData = {
                "deleted_data_json": JSON.stringify(getValue),
                "is_deleted": 1,
                "deleted_at": currentTime,
                "fullname": "Deleted User",
                "email": "",
                "phone_dial_code": "",
                "phone_number": "",
            },
                updateValue = await userModelObj.updateObj(updateData, whereId, tableConstants.USERS);

            // Set success response
            let response = {
                status: true,
                status_code: StatusCodes.OK,
                response: {}
            };
            return response;
        } catch (error) {
            // console.log(error);
            logger.log(error)
            return error
        }
    }

    /**
     * Change user status
     * @param {*} request 
     * @returns 
     */
    async statusChanged(request) {
        try {
            const requestBody = request.body,
                whereId = {
                    'id': requestBody.id
                }
            const userDetails = await userModelObj.fetchObj(whereId, tableConstants.USERS);
            let statusIs;
            if (userDetails[0].status == 1) {
                statusIs = '0'
            } else {
                statusIs = '1'
            }

            // Set what have to update 
            const updateStatus = {
                'status': statusIs
            }
            // For updating status
            const updatedStatus = await userModelObj.updateObj(updateStatus, whereId, tableConstants.USERS);

            if (updatedStatus == 1) {
                // Set success response
                let res = {
                    status: true,
                    status_code: StatusCodes.OK,
                    response: {}
                };
                return res;
            } else {
                let res = {
                    status: false,
                    status_code: StatusCodes.BAD_REQUEST,
                    response: {}
                };
                return res;
            }
        } catch (error) {
            logger.error(error)
            return error
        }
    }

    /**
     * Get user detail
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async getUserDetail(req, res) {
        try {
            const where = req.params.userId;
            const userData = await userModelObj.fetchUserDetail(where, tableConstants.USERS)
            // const commoditylistData = await this.commoditylist(where);

            // return false;
            const bornYear = userData[0].dob.getYear(),
                currentYear = new Date().getYear(),
                age = currentYear - bornYear;
            userData[0].age = age;
            if (userData[0].signup_type == 1) {
                userData[0].signup_type = "Normal"
            } else {
                userData[0].signup_type = "Social"
            }

            if (userData[0].social_type == 1) {
                userData[0].social_type = "Google";
            } else if (userData[0].social_type == 2) {
                userData[0].social_type = "Facebook";
            } else if (userData[0].social_type == 3) {
                userData[0].social_type = "Apple";
            }
            const changeFormat = DateTimeUtil.changeFormat(userData[0].dob, "DD/MM/YYYY"),
                join = DateTimeUtil.changeFormat(userData[0].joined_at, "DD/MM/YYYY");
            userData[0].dob = changeFormat
            userData[0].joined_at = join

            return userData;
        
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async commoditylist(req, res, next) {
        const id = Number(req.params.userId);
        const where = {
            "user_id": id
        },
            columns = [
                "commodities.id",
                "commodities.name",
                "commodities.rate_per_gram",
                "(CASE WHEN(users_commodities.total_quantity != '') THEN users_commodities.total_quantity ELSE 0 END ) AS total_quantity"
            ],
            query = `${columns}, (CASE WHEN( commodities.icon_image != "") THEN CONCAT('${s3CommoityImgPath}', commodities.icon_image)  ELSE '${avatar_placeholder}' END ) AS icon_image`;
        let commodityValue = 0;
        return userModelObj.fetchFirstObj(where, tableConstants.USERS_CASH).then((cashData) => {
            return userModelObj.getUserVault(query, id).then(async (vaultData) => {
                for (let i = 0; i < vaultData.length; i++) {
                    const element = vaultData[i];

                    element.price = await commonHelpers.roundNumber(element.total_quantity * element.rate_per_gram, 2);
                    commodityValue = commodityValue + element.price;
                    element.total_quantity = `${element.total_quantity}G`;
                    element.price = `$${element.price}`;
                }

                const userCash = cashData ? await commonHelpers.roundNumber(cashData.total_cash, 2) : 0;
                commodityValue = await commonHelpers.roundNumber(commodityValue, 2);
                const totalAmount = userCash + commodityValue;

                // Set response
                const commoditylistData = {
                    "user_cash": `$${userCash}`,
                    "commodity_value": `$${commodityValue}`,
                    "total_amount": `$${totalAmount}`,
                    "commodities": vaultData
                };

                return commoditylistData;
            }).catch((error) => {
                logger.error(error);
                throw errorObj;
            });
        }).catch((error) => {
            logger.error(error);
            throw errorObj;
        });
    };

    async userTransection(req, res) {
        try {
            return true

        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async userTransectionlist(req, res) {
        try {
            const where = req.body.user_id;
            var draw = req.body.draw;

            var start = req.body.start;

            var length = req.body.length;

            var order_data = req.body['order[0][column]'];
            var order = req.body['order[0][dir]']
            var total_records = await userModelObj.getTotalTransactionCount(where);
            total_records = total_records[0].total

            const userData = await userModelObj.getuserTransactionData(start, length, order_data, order, where);
            var total_records_with_filter = userData.length;


            userData.forEach(async (element, index) => {
                userData[index].s_no = index + 1 + Number(start)
                if (userData[index].transaction_type == 1) {
                    userData[index].transaction_type = "Add Commodity"
                    userData[index].transaction_desc = "commodity has been added";
                } else if (userData[index].transaction_type == 2) {
                    userData[index].transaction_type = "Send Commodity"
                    userData[index].transaction_desc = `commodity has been sent to ${userData[index].receiver_name}`;
                } else if (userData[index].transaction_type == 3) {
                    userData[index].transaction_type = "Received Commodity"
                    userData[index].transaction_desc = `you have received commodity from ${userData[index].sender_name}`;
                } else if (userData[index].transaction_type == 4) {
                    userData[index].transaction_type = "Withdraw Commodity"
                    userData[index].transaction_desc = "commodity has has been withdrawn";
                } else if (userData[index].transaction_type == 5) {
                    userData[index].transaction_type = "Add Cash"
                    userData[index].transaction_desc = "cash has been added";
                } else if (userData[index].transaction_type == 6) {
                    userData[index].transaction_type = "Withdraw Cash"
                    userData[index].transaction_desc = "cash has been withdrawn";
                } else if (userData[index].transaction_type == 7) {
                    userData[index].transaction_type = "Commodity to cash"
                    userData[index].transaction_desc = "commodity has been converted to cash";
                } else if (userData[index].transaction_type == 8) {
                    userData[index].transaction_type = "Receive physical commodity"
                    userData[index].transaction_desc = "physical commodity has been received";
                } else if (userData[index].transaction_type == 9) {
                    userData[index].transaction_type = "Deliver physical commodity"
                    userData[index].transaction_desc = "Your physical Gold has been converted to digital commodity";
                }

                const joinedAt = DateTimeUtil.changeFormat(userData[index].transaction_date, "DD/MM/YYYY hh:mm a");
                userData[index].transaction_date = joinedAt

            });
            var output = {
                'draw': draw,
                'iTotalRecords': total_records,
                'iTotalDisplayRecords': total_records_with_filter,
                'aaData': userData,
            };
            res.json(output);
        } catch (error) {
            console.log(error);
            return error;
        }
    }

}