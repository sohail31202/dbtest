import BaseModel from '~/models/BaseModel'
import tableConstants from '~/constants/tableConstants'
import commonConstants from '~/constants/commonConstants'
import knexJs from "knex";
import knexConfig from "~/config/knexfile";
const knex = knexJs(knexConfig);
const baseModelObj = new BaseModel();
const S3BasePath = process.env.S3_BASE_PATH,
    directory = commonConstants.AVATAR_FOLDER,
    storageDirectory = process.env.STORAGE_DIRECTORY,
    s3ProfilePath = `${S3BasePath}${storageDirectory}/${directory}/`;

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
            "deleted_at",
            "deleted_data_json",
            "CONCAT( phone_dial_code, phone_number) as contact"
        ];

        var result = knex('users')

            .select(knex.raw(sel))
            .limit(limit)
            .offset(start)
            .groupBy('id')
            .orderBy('id', 'desc')
        // .leftJoin("users_addresses","users_addresses.user_id", "users.id")

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

    /**
     * This query is used to get user detail
     * @param {*} whereId 
     * @param {*} tableName 
     * @returns 
     */
    async fetchUserDetail(whereId, tableName = '') {

        var columns = ["profile_img", "CONCAT( phone_dial_code, phone_number) as contact", "users.id", "fullname", "email", "dob", "signup_type", "user_address.address as uaddress", "address_type", "users.created_at as joined_at", "social_type"],
            qwery = `${columns}, (CASE WHEN( profile_img != "" && is_img_url != 1) THEN CONCAT('${s3ProfilePath}', profile_img) WHEN( profile_img != "" && is_img_url = 1) THEN profile_img ELSE '${avatar_placeholder}' END ) AS profile_img`;

        let prepareQuery = await knex(tableName)
            .select(knex.raw(qwery))
            .leftJoin('users_addresses as user_address', `user_address.user_id`, `users.id`)
            .leftJoin('user_connected_accounts', `user_connected_accounts.user_id`, `users.id`)

            .where({ 'users.id': whereId });

        prepareQuery = prepareQuery.map((res) => {
            return res;
        });
        return prepareQuery;

    }

    async getTotalTransactionCount(whereId) {
        var result = knex('users_transactions')
            .count('id as total')
            .where({ 'users_transactions.user_id': whereId })
            .orderBy("id", "desc")
        return result.then(function (rows) {
            return rows;
        });
    }

    async getuserTransactionData( start = 0, limit = 10, order_data, order,where) {
        const sel = [
            "users_transactions.id",
            "transaction_type",
            "CONCAT( commodity_amount, commodity_amount_unit) as transaction_ammount",
            "commodity_id",
            "sender.fullname as sender_name",
            "receiver.fullname as receiver_name",
            "commodities.name as commodity_name",
            "transaction_date"
        ];

        var result = knex('users_transactions')

            .select(knex.raw(sel))
            .limit(limit)
            .offset(start)
            .leftJoin('commodities', `commodities.id`, `users_transactions.commodity_id`)
            .leftJoin('users as sender', `sender.id`, `users_transactions.sender_id`)
            .leftJoin('users as receiver', `receiver.id`, `users_transactions.receiver_id`)
            .groupBy('id')
            .orderBy('id', 'desc')
            .where('users_transactions.user_id',where)
        
        return result.then(function (rows) {
            return rows;
        });
    }

    getUserVault(cols, userId) {
        let prepareQuery = knex(tableConstants.COMMODITIES)
            .select(knex.raw(cols))
            .leftJoin(tableConstants.USER_COMMODITIES, function () {
                this
                  .on('users_commodities.commodity_id', 'commodities.id')
                  .on('users_commodities.user_id', userId);
              })
              .orderBy("commodities.id", "ASC");
console.log("lq prepareQuery-------", prepareQuery.toString());
        prepareQuery = prepareQuery.then((res) => {
            return res;
        });

        return prepareQuery;
    }
}