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
export {
    user
};