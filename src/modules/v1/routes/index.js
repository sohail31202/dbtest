import { Router } from "express";
import { admin } from "../admin/routes";
import { auth } from "../auth/routes";
import { setting } from "../setting/routes";
import { user } from "../user/routes";

const v1routes = new Router();
v1routes.use("/", auth);
v1routes.use("/", admin);
v1routes.use("/", setting);
v1routes.use("/", user);

export { v1routes };
