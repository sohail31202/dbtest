import { Router } from "express";
import settingController from "!/setting/controllers/settingController";
import sessionServices from "~/middlewares/sessionManager";
import { updateContentValidator } from "../validators/updateContentValidator";


// create object for meta controller routes
const setting = new Router();

// // Create route for edit terms and conditions in settingControllers.
setting.get("/edit-terms-and-conditions", sessionServices, settingController.editTermsAndConditions);

// // Create route for edit about us in settingControllers.
setting.get("/edit-privacy-policy", sessionServices, settingController.editPrivacyPolicy);

// // Create route for update content page in settingControllers.
setting.post("/update-static-page-content", updateContentValidator, settingController.updateContentPage);

// Create route for edit terms and conditions in settingControllers.
setting.get("/terms-and-conditions", settingController.termsAndConditions);

// Create route for about us in settingControllers.
setting.get("/privacy-policy", settingController.privacyPolicy);

export {
    setting
};