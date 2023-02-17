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


const email = new Email();
const JwtAuthSecurityObj = new JwtAuthSecurity();
const userModelObj = new userModel();


const currentTime = DateTimeUtil.getCurrentTimeObjForDB();

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
    async userlist(req, res) {
        try {
            var draw = req.body.draw;

            var start = req.body.start;

            var length = req.body.length;

            var order_data = req.body['order[0][column]'];
            var order = req.body['order[0][dir]']

            // search data
            var search = req.body['search[value]'];

            if (search != '' && search != undefined) {

                var search_value = search.trim();

                var search_query = `
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

            userData.forEach((element, index) => {
                userData[index].s_no = index + 1 + Number(start)
                const statusIs = element.status == 1 ? 'Inactivate' : 'Activate';

                // const statusIconText = element.status == 1 ? 'Inactive' : 'Active';

                const statusIsIcon = element.status == 1 ? '<i class="fa fa-ban mx-2" aria-hidden="true"></i>': '<i class="fa fa-check-circle mx-2" aria-hidden="true"></i>';

                let Action, status;
                if (element.is_deleted == 1) {
                    Action = "";
                    status = '<span class="badge badge-danger" aria-hidden="true">Deleted</span>'
                } else {

                    Action = ` <a href="#" data-toggle="modal" data-target="#deleteModal" title="Delete" class="btn btn-danger btn-rounded btn-icon" onclick="deleteuser('${element.id}')"><i class="ti-trash" aria-hidden="true"></i></a>

                        <a href="#" data-toggle="modal" data-target="#changeStatusModal" title="${statusIs}" class='btn btn-info btn-rounded btn-icon' onclick="changeStatus('${element.id}','${statusIs}')">${statusIsIcon}</a>

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


    async deleteUser(request) {
        try {
            // Set a where condition
            const whereId = {
                'id': request.params.id
            },
                currentTime = DateTimeUtil.getCurrentTimeObjForDB(),

                column = ['fullname', 'email', 'phone_dial_code', 'phone_number'],
                getValue = await userModelObj.fetchObjWithSingleRecord(whereId, column, tableConstants.USERS),
                updateData = {
                    "deleted_data_json": JSON.stringify(getValue),
                    "is_deleted": 1,
                    "deleted_at": currentTime,
                    "fullname": "Deleted",
                    "email": "",
                    "phone_dial_code": "",
                    "phone_number": ""
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
}