import { Router } from "express";
import sessionServices from "~/middlewares/sessionManager";
import shipmentController from "../controllers/shipmentController";

// create object for shipment controller routes
const shipment = new Router();

// Create route for get dashboard page in shipmentControllers.
// shipment.get('/shipment', sessionServices, shipmentController.shipment );
shipment.get('/shipment', sessionServices, shipmentController.getShipment)

// Get users
shipment.post('/shipment-list', sessionServices, shipmentController.shipmentlist);

// Get user details
shipment.get("/shipping-detail/:shipmentId", sessionServices, shipmentController.shipmentDetail);

// Get user details
shipment.get("/create-shipment/:shipmentId", sessionServices, shipmentController.createShipment);

// Delete user
shipment.post('/update-shipment-detail/:shipmentId', sessionServices, shipmentController.updateShipment);

// // change-user-status
// user.post('/change-user-status', sessionServices, userController.statusChanged);


// // Get user transaction list
// user.post('/user-transection-list', sessionServices, userController.userTransectionlist);

export {
    shipment
};