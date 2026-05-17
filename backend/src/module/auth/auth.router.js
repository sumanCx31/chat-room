const authRouter = require("express").Router();
const bodyValidator = require("../../middleware/auth.validator");
const uploader = require("../../middleware/uploader.middleware");
const authCltr = require("./auth.controller");
const UserRegisterationDTO = require("./auth.validator");

authRouter.post("/register", uploader().single("image"), bodyValidator(UserRegisterationDTO), authCltr.register);
authRouter.post("/activate",authCltr.activateAccount);
authRouter.post("/login",authCltr.login);
authRouter.post("/change-password",authCltr.changePassword);
authRouter.get("/users",authCltr.getAllUsers);
authRouter.get("/me", authCltr.loggedInUserProfile)

module.exports = authRouter;