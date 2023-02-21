import BaseModel from '~/models/BaseModel'
import tableConstants from '~/constants/tableConstants'
import commonConstants from '~/constants/commonConstants'
import knexJs from "knex";
import knexConfig from "~/config/knexfile";
const knex = knexJs(knexConfig);
const baseModelObj = new BaseModel();


export default class userModel extends BaseModel {

    /**
     * Create Query for conatct list.
     * @param {*} search 
     * @param {*} where 
     * @returns 
     */
    async getTotalCount(search = "") {
        var result = knex('users')
            .count('id as total')
            .orderBy("id", "desc")
        if (search) {
            result.where(knex.raw(search));
        }
        return result.then(function (rows) {
            return rows[0].total;
        });
    }
    async getUserTotalCount(search = "", start = 0, limit = '', where = "", filter = '') {
        const sel = [
            "id"
        ];
        var result = knex('users')
           
            .select(sel)
            .groupBy('id')
            .orderBy('id', 'desc')

        if (search || where) {
            if (where && where != '') {
                result.andWhere(knex.raw(search));
                result.andWhere('email', where);
                result.andWhere('phone_number', where);
            } else {
                result.andWhere(knex.raw(search));
            }
        }

        if (filter != '' && filter) {
            if (filter == 1) {
                result.orderBy('id', 'asc');
            }
        }

        return result.then(function (rows) {
            return rows;
        });
    }

    async getuserData(search = "", start = 0, limit = 10, order_data, order, where = "", filter = '') {
    const sel = [
            "id",
            "fullname", 
            "email",  
            "status",
            "is_deleted",
            "deleted_data_json",
            "CONCAT( phone_dial_code, phone_number) as contact"
        ];

        var result = knex('users')
           
            .select(knex.raw(sel))
            .limit(limit)
            .offset(start)
            .groupBy('id')
            .orderBy('id', 'desc')

        if (search || where) {
            if (where && where != '') {
                result.andWhere(knex.raw(search));
                result.andWhere('email', where);
                result.andWhere('phone_number', where);
            } else {
                result.andWhere(knex.raw(search));
            }
        }

        if (filter != '' && filter) {
            if (filter == 1) {
                result.orderBy('id', 'asc');
            }
        }
        if (order_data == 1) {
            result.orderBy('users.fullname', order)
        }

        if (order_data == 2) {
            result.orderBy('users.email', order)
        }
        if (order_data == 3) {
            result.orderBy('users.phone_number', order)
        }
        if (order_data == 4) {
            result.orderBy('users.status', order)
        }
        return result.then(function (rows) {
            return rows;
        });
    }
}