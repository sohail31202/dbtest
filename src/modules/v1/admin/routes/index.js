import { Router } from "express";
import adminController from "!/admin/controllers/adminController";
import sessionServices from "~/middlewares/sessionManager";

// create object for admin controller routes
const admin = new Router();

// Create route for get dashboard page in adminControllers.
admin.get("/dashboard", sessionServices, adminController.getDashboard);



export {
    admin
};