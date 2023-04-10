import BaseModel from '~/models/BaseModel'
import tableConstants from '~/constants/tableConstants'
import commonConstants from '~/constants/commonConstants'
import knexJs from "knex";
import knexConfig from "~/config/knexfile";
const knex = knexJs(knexConfig);
const baseModelObj = new BaseModel();


export default class AdminModel extends BaseModel {

    /**
     * Create Query for conatct list.
     * @param {*} search 
     * @param {*} where 
     * @returns 
     */
    getTotalUserCount(search = "", where = "") {
        var result = knex('contacts')
            .count('id as total')

        if (search || where) {

            result.where(knex.raw(search));
        }
        return result.then(function (rows) {
            return rows[0].total;
        });
    }

   
    /**
     * Get Sale And Purchase Commodoty Quantity.
     *
     * @param {Object} query The query to match against.
     * @param {Object} wherein The query to match against.
     * @param {String} tableName The query to match against.
     * @returns {Array} An array holding resultant models.
     */
    getSaleAndPurchaseCommodity(query = [ "COALESCE(SUM(users_transactions.commodity_in_gram), 0) as purchase_commodity" ], transType = [7, 9]) {
        let prepareQuery = knex("commodities")
            .select(knex.raw( query ))
            .leftJoin('users_transactions', function() {
                this.on('users_transactions.commodity_id', '=', 'commodities.id')
                    .onIn('users_transactions.transaction_type', transType)
                    .onNotNull('users_transactions.commodity_in_gram')
            })
            .groupBy("commodities.id");
        return prepareQuery = prepareQuery.then((res) => {
            return res;
        });
    }

    /**
     * Create Query for conatct list.
     * @param {*} search 
     * @param {*} start 
     * @param {*} limit 
     * @param {*} where 
     * @returns 
     */
    getUserWithLimitOffset(search = "", start = 0, limit = 10, where = "", column_name = "", sorting="", column_index="0") {
        var result = knex('contacts')
            .limit(limit)
            .offset(start)
            
        if (search || where) {
            result.where(knex.raw(search));
        }
        if (column_index == 0) {
            result.orderBy('id', 'desc')
        } else{
            result.orderBy(column_name, sorting)
        }

        return result.then(function (rows) {
            return rows;
        });
    }


       /**
     * Create Query for jobs list.
     * @param {*} search 
     * @param {*} where 
     * @returns 
     */
        getTotalUserCountJobs(search = "", where = "") {
            var result = knex('jobs')
                .count('id as total')
               
            if (search || where) {
    
                result.where(knex.raw(search));
            }
            return result.then(function (rows) {
                return rows[0].total;
            });
        }
    
        /**
         * Create Query for jobs list.
         * @param {*} search 
         * @param {*} start 
         * @param {*} limit 
         * @param {*} where 
         * @returns 
         */
        getUserWithLimitOffsetJobs(search = "", start = 0, limit = 10, where = "", column_name = "", sorting="", column_index="0") {
       
            var result = knex('jobs')
                .limit(limit)
                .offset(start)
            if (search || where) {
                result.where(knex.raw(search));
            }
            if (column_index == 0) {
                result.orderBy('id', 'desc')
            } else {
                result.orderBy(column_name, sorting)
            }
            return result.then(function (rows) {
               
                return rows;
            });
        }
}