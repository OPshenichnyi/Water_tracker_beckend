import express from "express";
import * as userSchemas from "../models/User.js";
import { validateBody } from "../decorators/index.js";
import authControler from "../controllers/auth-controler.js";
import { authenticate, upload } from "../middlewares/index.js";

const authRouter = express.Router();
const registerAndLoginSchema = validateBody(userSchemas.registerAndLoginSchema);
const updateProfilSchema = validateBody(userSchemas.updateProfilSchema);
const waterRateSchema = validateBody(userSchemas.waterRateSchema);

authRouter.post("/register", registerAndLoginSchema, authControler.signup);
authRouter.post("/login", registerAndLoginSchema, authControler.signin);
authRouter.post("/logout", authenticate, authControler.signout);

authRouter.patch("/avatars", upload.single("avatarURL"), authenticate, authControler.updateAvatar);
authRouter.get("/current", authenticate, authControler.getCurrent);
authRouter.patch("/", authenticate, updateProfilSchema, authControler.updateProfil);

authRouter.patch("/water-rate",authenticate, waterRateSchema, authControler.waterRate);

export default authRouter;