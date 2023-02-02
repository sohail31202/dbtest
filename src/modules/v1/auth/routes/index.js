import { Router } from "express";
import authController from "!/auth/controllers/authController";
import { loginValidator } from "!/auth/validators/loginValidator"
import checkApiHeaders from "~/middlewares/checkApiHeaders"
import formParser from "~/middlewares/formParser";

// create object for auth controller routes
const auth = new Router();

var csrf = require('csurf');
var csrfProtect = csrf({ cookie: true });

/*
 * create routes for admin normal login get method in authController.
 */
auth.get('/', csrfProtect, authController.login);

/**
 * create routes for admin verify login post method in authController.
 */
auth.post('/verify-login', loginValidator, csrfProtect, formParser, authController.verifyLogin);

/*
 * created route for admin logout.
 */
auth.get('/logout', authController.logout);

export {
    auth
};