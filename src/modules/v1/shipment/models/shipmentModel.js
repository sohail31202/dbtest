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
            .orWhereNot('user_shipments.status', 0)
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


    async getShipmentData(search = "", start = 0, limit = 10, order_data, order, where = "", filter = '', commodity = [], shipmentType = '', status = []) {
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

        if (status.length > 0) {
            result.where(function () {
                this.whereIn('user_shipments.status', status).orWhereIn('user_shipments.shipment_status', status)
            })
        }

        if (shipmentType != '') {
            result.andWhere("user_shipments.shipment_type", shipmentType);
        }

        return result.then(function (rows) {
            return rows;
        });
    }

    async filterShipmentCount(search = "", where = "", commodity = [], shipmentType = '', status = []) {
        const result = knex('user_shipments')
            .select(knex.raw('COUNT(*) as count'))
            .groupBy('user_shipments.id')
            .orWhereNot('user_shipments.status', 0)
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
      
        if (status.length > 0) {
            result.where(function () {
                this.whereIn('user_shipments.status', status).orWhereIn('user_shipments.shipment_status', status)
            })
        }

        if (shipmentType != '') {
            result.andWhere("user_shipments.shipment_type", shipmentType);

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
            "CONCAT( currency_unit, FORMAT(shipment_charge," + commonConstants.ROUND_DIGIT + ")) as shipment_charge",
            "address_json",
            "user_shipments.created_at",
            "CONCAT(currency_unit, FORMAT(admin_brokerage," + commonConstants.ROUND_DIGIT + ")) as admin_brokerage",
            "CONCAT(currency_unit, FORMAT(processing_fee," + commonConstants.ROUND_DIGIT + ")) as processing_fee",
            "CONCAT(currency_unit, FORMAT(total_amount," + commonConstants.ROUND_DIGIT + ")) as total_amount",
            "payment_method",
            "tracking_url",
            "label_file_url",
            "pkg_weight",
            "pkg_dimensions",
            "admin_address_json"
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
            .select("name", "id")
            .then((res) => {
                return res;
            });
    }


    async fetchShipmentStatus(tableName = tableConstants.USER_SHIPMENTS) {
        return knex(tableName)
            .distinct('shipment_status')
            .whereNotNull('shipment_status')
            .select()
            .then((res) => {
                return res;
            });
    }

}