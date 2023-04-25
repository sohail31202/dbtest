import axios from 'axios';
import { log } from 'winston';
import logger from "~/utils/logger";

const ShipengineBaseurl = process.env.SHIPENGINE_BASEURL;
const ShipengineApikey = process.env.SHIPENGINE_APIKEY;
const ShipengineHost = process.env.SHIPENGINE_HOST;

export default class Shipengine {

    constructor() {
        this.rate_options = {
            "carrier_ids": process.env.CARRIER_ID.split(','),
            "service_codes": process.env.SERVISE_CODES.split(',')
        },
        this.SHIPENGINE_BASEURL = process.env.SHIPENGINE_BASEURL,
        this.HEADERS = {
            headers: {
                "Host": process.env.SHIPENGINE_HOST,
                "API-Key": process.env.SHIPENGINE_APIKEY,
                "Content-Type": 'application/json'
            }
        }
    }

    async getOptions () {
        return { 
            headers: {
                "Host": ShipengineHost,
                "API-Key": ShipengineApikey,
                "Content-Type": 'application/json'
            }
        }
    }
    
    async validateAddress(postData) {
        
        const options =await this.getOptions();

        return await axios.post(ShipengineBaseurl+'addresses/validate', postData, options)
          .then(function (response) {
            
            return response.data;
          })
          .catch(function (error) {
            logger.error(error.response.data.errors);
            console.log(error.response.data.errors);
          })

    }

    async fetchShippingRates(shipment) {
        const params = {
            "rate_options": this.rate_options,
            "shipment": shipment
        };
     
        // return shipengine.getRatesWithShipmentDetails(params).then( ( result ) => {
        return axios.post(`${this.SHIPENGINE_BASEURL}rates`, params, this.HEADERS).then( ( result ) => {

            return { "status": true, "data": result.data };
        }).catch( (error) => {
            logger.error(error.response.data.errors);
            return { "status": false, "data": error };
        } );
    }

    async createShipment(params) {
        return axios.post(`${this.SHIPENGINE_BASEURL}shipments`, params, this.HEADERS).then( ( result ) => {

            return { "status": true, "data": result.data };
        }).catch( (error) => {
            console.log("Error creating rates",`${error.response.data.errors[0].field_name}: ${error.response.data.errors[0].message}`);
            logger.error(`${error.response.data.errors[0].field_name}: ${error.response.data.errors[0].message}`);
            return { "status": false, "data": error };
        } );
    }

    async shipmentLabel(params, shipmentId) {
        return axios.post(`${this.SHIPENGINE_BASEURL}labels/shipment/${shipmentId}`, params, this.HEADERS).then( ( result ) => {

            return { "status": true, "data": result.data };
        }).catch( (error) => {
            console.log("shipment labels error",error.response.data.errors);
            return { "status": false, "data": error };
        } );
    }

    async trackShipment(labelId) {
        return axios.get(`${this.SHIPENGINE_BASEURL}labels/${labelId}/track`, this.HEADERS).then( ( result ) => {

            return { "status": true, "data": result.data };
        }).catch( (error) => {
            console.log("Error tracked",`${error.response.data.errors[0].field_name}: ${error.response.data.errors[0].message}`);
            logger.error(`${error.response.data.errors[0].field_name}: ${error.response.data.errors[0].message}`);
            return { "status": false, "data": error };
        } );
    }

    async cancelShipment(shipmentId) {
      return axios.put(`${this.SHIPENGINE_BASEURL}shipments/${shipmentId}/cancel`, this.HEADERS).then( ( result ) => {
          
          return { "status": true, "data": result.data };
      }).catch( (error) => {
          console.log("Error cancel",`${error.response.data.errors[0].field_name}: ${error.response.data.errors[0].message}`);
          logger.error(`${error.response.data.errors[0].field_name}: ${error.response.data.errors[0].message}`);
          return { "status": false, "data": error };
      } );
    }

    async getShipment(id) {
        return axios.get(`${this.SHIPENGINE_BASEURL}shipments/${id}`, this.HEADERS).then( ( result ) => {

            return { "status": true, "data": result.data };
        }).catch( (error) => {
            console.log("Error get Shipment: ", error);
            logger.error(error.message);
            return { "status": false, "data": error };
        } );
    }

    async shipmentsList(postData) {
          
      const options =await this.getOptions();

      return await axios.get(ShipengineBaseurl+'shipments?page_size=50', options)
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          logger.error(error.response.data.errors);
          console.log(error.response.data.errors);
        });
    }

    async fetchCarrierServices(getData) {
      const options =await this.getOptions();
      
      return await axios.get(ShipengineBaseurl+'carriers/'+getData.carrier_id+'/services', options)
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          logger.error(error.response.data.errors);
          console.log(error.response.data.errors);
        });
    }
}
