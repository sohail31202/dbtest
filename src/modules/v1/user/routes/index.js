import { Router } from "express";
import userController from "!/user/controllers/userController";
import sessionServices from "~/middlewares/sessionManager";

// create object for user controller routes
const user = new Router();

// Create route for get dashboard page in userControllers.
user.get('/users', sessionServices, userController.getUser );

user.post('/user-list', sessionServices, userController.userlist);

// Delete user
user.post('/delete-user', sessionServices, userController.deleteUser);

// change-user-status
user.post('/change-user-status', sessionServices, userController.statusChanged);

// Get user details
user.get("/user-detail/:userId", sessionServices, userController.userDetail);

// Get user transection list
// user.get('/user-transection', sessionServices, userController.userTransection );

user.post('/user-transection-list', sessionServices, userController.userTransectionlist);


// user.post('/commodity-list', sessionServices, userController.commoditylist);



export {
    user
};