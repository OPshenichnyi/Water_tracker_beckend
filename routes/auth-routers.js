import express from "express";
import * as userSchemas from "../models/User.js";
import { validateBody } from "../decorators/index.js";
import authControler from "../controllers/auth-controler.js";
import { authenticate } from "../middlewares/index.js";

const authRouter = express.Router();
const userSignupValidate = validateBody(userSchemas.userSignupSchema);
const userSigninValidate = validateBody(userSchemas.userSigninSchema);

authRouter.post("/register", userSignupValidate, authControler.signup);
authRouter.post("/login", userSigninValidate, authControler.signin);
authRouter.get("/current", authenticate, authControler.getCurrent);
authRouter.post("/logout", authenticate, authControler.signout);

export default authRouter;
