import BaseModel from '~/models/BaseModel'
import tableConstants from '~/constants/tableConstants'
import commonConstants from '~/constants/commonConstants'
import knexJs from "knex";
import knexConfig from "~/config/knexfile";
import { result } from 'lodash';
const knex = knexJs(knexConfig);
const baseModelObj = new BaseModel();
const S3BasePath = process.env.S3_BASE_PATH,
    directory = commonConstants.AVATAR_FOLDER,
    storageDirectory = process.env.STORAGE_DIRECTORY,
    s3ProfilePath = `${S3BasePath}${storageDirectory}/${directory}/`;

export default class shipmentModel extends BaseModel {

    /**
     * Create Query for conatct list.
     * @param {*} search 
     * @param {*} where 
     * @returns 
     */
    async getTotalCount(search = "") {
        var result = knex('user_shipments')
            .count('id as total')
            // .orderBy("id", "desc")
        if (search) {
            result.where(knex.raw(search));
        }
        return result.then(function (rows) {
            return rows[0].total;
        });
    }

    async getShipmentTotalCount(search = "", start = 0, limit = '', where = "", filter = '') {
        const sel = [
            "id"
        ];
        var result = knex('user_shipments')

            .select(sel)
            .groupBy('id')
            .orderBy('id', 'desc')

        if (search || where) {
            if (where && where != '') {
                result.andWhere(knex.raw(search));
                // result.andWhere('email', where);
                // result.andWhere('phone_number', where);
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
    
      
    async getShipmentData(search = "", start = 0, limit = 10, order_data, order, where = "", filter = '', commodity = [], shipmentType= '', status = '') {
        const sel = [
            "user_shipments.id",
            "users.fullname as user_name",
            "CONCAT(commodities.name, '(', quantity, quantity_unit, ')') as commodity",
            "shipment_type",
            "shipment_id",
            "user_shipments.status",
            "shipment_status",
            "CONCAT( currency_unit, shipment_charge) as shipment_charge",
            "address_json",
            "user_shipments.created_at"
        ];

        var result = knex('user_shipments')

            .select(knex.raw(sel))
            .limit(limit)
            .offset(start)
            .groupBy('id')
            .orderBy('id', 'desc')
            .orWhereNot('user_shipments.status', 0)
            .leftJoin('users', 'user_shipments.user_id', 'users.id')
            .leftJoin('commodities', 'user_shipments.commodity_id', 'commodities.id')

        if (search || where) {
            if (where && where != '') {
                result.andWhere(knex.raw(search));
            } else {
                result.andWhere(knex.raw(search));
            }
        }

        if (filter != '' && filter) {
            if (filter == 1) {
                result.orderBy('id', 'asc');
            }
        }

        if (commodity.length > 0) {
            result.whereIn('commodities.id', commodity)
        }
        if (shipmentType != '') {
            result.andWhere("user_shipments.shipment_type", shipmentType);
            
        }
        if (status != '') {
            result.andWhere("user_shipments.status", status);
        }
        return result.then(function (rows) {
            return rows;
        });
    }

    async filterShipmentCount(search = "", where = "", commodity = [], shipmentType= '', status = '') {
        const result = knex('user_shipments')
            .select(knex.raw('COUNT(*) as count'))
            .groupBy('user_shipments.id')
            .orWhereNot('user_shipments.status', 0)
            .leftJoin('users', 'user_shipments.user_id', 'users.id')
            .leftJoin('commodities', 'user_shipments.commodity_id', 'commodities.id')

        if (search || where) {
            if (where && where != '') {
                result.andWhere(knex.raw(search));
            } else {
                result.andWhere(knex.raw(search));
            }
        }

        if (commodity.length > 0) {
            result.whereIn('commodities.id', commodity)
        }
        if (shipmentType != '') {
            result.andWhere("user_shipments.shipment_type", shipmentType);
            
        }
        if (status != '') {
            result.andWhere("user_shipments.status", status);
        }
        
        const rows = await result;
        return rows.length;
}


    
    async fetchShipmentDetail(whereQuery, tableName) {
        const sel = [
            "user_shipments.id",
            "users.fullname as user_name",
            "commodities.name as commodity_name",
            "CONCAT( quantity, ' ', quantity_unit) as quantity",
            "shipment_type",
            "shipment_id",
            "user_shipments.status",
            "user_shipments.commodity_id",
            "shipment_status",
            "CONCAT( currency_unit, shipment_charge) as shipment_charge",
            "address_json",
            "user_shipments.created_at",
            "CONCAT(currency_unit, admin_brokerage) as admin_brokerage",
            "CONCAT(currency_unit, processing_fee) as processing_fee",
            "CONCAT(currency_unit, total_amount) as total_amount",
            "payment_method",
            "tracking_url",
            "label_file_url",
            "pkg_weight",
            "pkg_dimensions"
        ];

        var result = knex(tableName)

            .select(knex.raw(sel))
            .where(whereQuery)
            .leftJoin('users', 'user_shipments.user_id', 'users.id')
            .leftJoin('commodities', 'user_shipments.commodity_id', 'commodities.id')
            .first()


        return result.then(function (rows) {
            return rows;
        });
    }

    async fetchCommodity(tableName = tableConstants.COMMODITIES) {
        return knex(tableName)
            .select("name","id")
            .then((res) => {
                return res;
            });
        }
}