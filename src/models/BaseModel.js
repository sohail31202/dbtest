import knexJs from "knex";
import { log } from "winston";
import knexConfig from "~/config/knexfile";
import tableConstants from "~/constants/tableConstants";

const knex = knexJs(knexConfig);

/**
 * define base model
 */
class BaseModel {

    /**
     * Define base model constructor.
     */
    constructor() {
        this._hasTimestamps = false;
    }

    /**
     * Get the table used for this model.
     *
     * @returns {string} The database table used.
     */
    static get table() {
        return this._table;
    }

    /**
     * Set the table used for this model.
     *
     * @param {string} t The database table to be used.
     */
    static set table(t) {
        this._table = t;
    }

    /**
     * Get the hasTimestamps used for this model.
     *
     * @returns {string} The hasTimestamps setting.
     */
    static get hasTimestamps() {
        return this._hasTimestamps;
    }

    /**
     * Set the hasTimestamps used for this model.
     *
     * @param {string} t The hasTimestamps setting.
     */
    static set hasTimestamps(t) {
        this._hasTimestamps = t;
    }

    /**
     * Get the primary or compound keys used to uniquely identify a model.
     *
     * @returns {array} The columns used to uniquely identify a model.
     */
    static get keys() {
        if (!this._keys) {
            this._keys = [];
        }

        return this._keys;
    }

    /**
     * Set the primary or compound keys used to uniquely identify a model.
     *
     * @param {array} k The columns used to uniquely identify a model.
     */
    static set keys(k) {
        this._keys = k;
    }

    /**
     * Get a all rows from table.
     *
     * @param {String} tableName The query to match against.
     */
    fetchAll(tableName = this.table) {
        return knex(tableName)
            .select()
            .then((res) => {
                return res;
            });
    }

    /**
     * Get a collection of models matching a given query.
     *
     * @param {Object} query The query to match against.
     * @param {String} tableName The query to match against.
     * @returns {Array} An array holding resultant models.
     */
    fetchObj(query = {}, tableName = this.table) {
        return knex(tableName)
            .select()
            .where(query)
            .then((res) => {
                return res;
            });
    }


    /**
     * Get a collection of models matching a given query.
     *
     * @param {Object} query The query to match against.
     * @param {String} tableName The query to match against.
     * @returns {Array} An array holding resultant models.
     */
    fetchJoinObj(query = {}, joinKey, joinTable, tableKey, tableName = this.table) {
        return knex(tableName)
            .select(knex.raw(`*`))
            .join(joinTable, `${tableName}.${tableKey}`, `${joinTable}.${joinKey}`)
            .where(query)
            .map((res) => {
                return res;
            });

    }



    /**
     * Get a collection of models matching a given query.
     *
     * @param {Object} query The query to match against.
     * @param {String} tableName The query to match against.
     * @returns {Array} An array holding resultant models.
     */
    async fetchFirstObj(query = {}, tableName = this.table) {
        return knex(tableName)
            .select()
            .where(query)
            .first();
    }

    /**
     * Get a collection of models matching a given query.
     *
     * @param {Object} query The query to match against.
     * @param {Object} opts Options.
     * @param {String} tableName The query to match against.
     * @returns {Array} An array holding resultant models.
     */
    fetchObjWithSingleRecord(query = {}, opts = {}, tableName = this.table) {

        return knex(tableName)
            .select(knex.raw(opts))
            .where(query)
            .first()
            .then((row) => {

                return row;
            });
    }

    /**
     * Get a collection of models matching a given query.
     *
     * @param {Object} query The query to match against.
     * @param {Object} opts Options.
     * @param {String} tableName The query to match against.
     * @param {Object} orderby
     * @param {Object} order
     * @returns {Array} An array holding resultant models.
     */
    fetchObjWithSelectedFields(query = {}, opts = {}, tableName = this.table, orderby, order) {
        let prepareQuery = knex(tableName)
            .select(opts)
            .where(query);

        if (orderby !== undefined && order !== undefined) {
            prepareQuery = prepareQuery.orderBy(orderby, order);
        }
        prepareQuery = prepareQuery.map((res) => {
            return res;
        });

        return prepareQuery;
    }

    /**
     * Get a collection of models matching a given query.
     *
     * @param {Object} query The query to match against.
     * @param {Object} opts Options.
     * @param {String} tableName The query to match against.
     * @param {Object} orderBy Order by.
     * @param {String} order Order.
     * @returns {Array} An array holding resultant models.
     */
    fetchObjWithSelectedFieldsOrderBy(query = {}, opts = {}, tableName = this.table, orderBy, order) {
        return knex(tableName)
            .select(opts)
            .where(Util.toSnake(query))
            .orderBy(orderBy, order)
            .map((res) => {
                return res;
            });
    }

    /**
     * Get a collection of models matching a given query.
     *
     * @param {Object} query The query to match against.
     * @param {Object} wherein The query to match against.
     * @param {String} tableName The query to match against.
     * @returns {Array} An array holding resultant models.
     */
    fetchObjWhereIn(query = {}, wherein = [], tableName = this.table) {
        let prepareQuery = knex(tableName)
            .select()
            .where(query);

        if (wherein.length > 0) {
            prepareQuery = prepareQuery.whereIn("id", wherein);
        }
        prepareQuery = prepareQuery.map((res) => {
            return res;
        });

        return prepareQuery;

    }

    /**
     * Inserts a new model into the database then returns an instantiation of the model.
     *
     * @param {Object} properties The Model properties.
     * @param {String} tableName The query to match against.
     * @returns {*} An instantiation of the model.
     */
    createObj(insertdata, tableName = this.table) {
        let prepareQuery = insertdata;

        return knex(tableName)
            .insert(prepareQuery);

        prepareQuery.spread((res) => {
            return res;
        });
    }

    /**
     * Saves the properties currently set on the model.
     *
     * @param {Object} properties The properties to update.
     * @param {Object} query Where clause for updating.
     * @param {String} tableName The query to match against.
     * @returns {Array} A collection of the updated models.
     */
    updateObj(properties, query = {}, tableName = this.table) {
        return knex(tableName)
            .update(properties)
            .where(query)
            .then((res) => {
                return res;
            });
    }

    /**
     * Delete the records against query on the model.
     *
     * @param {Object} query Where clause for delete data.
     * @param {String} tableName The Table name to match against.
     * @returns {Array} A collection of the updated models.
     */
    deleteObj(query = {}, tableName = this.table) {

        return knex(tableName)
            .where(query)
            .del()
            .then((res) => {
                return res;
            });
    }

    /**
     * Saves the properties currently set on the model.
     *
     * @param {String} tableName The query to match against.
     * @param {Object} query The properties to update.
     * @returns {Array} A collection of the updated models.
     */
    getCount(tableName = this.table, query = {}) {
        return knex(tableName)
            .count({
                "count": "*"
            })
            .where(query)
            .then((res) => {

                return res[0].count;
            });
    }







}
export default BaseModel;