//Abb humme yaahan saare endpoints of the auth ko ek saath manage karna ahin
const { Router } = require("express");
const { userregisterController, loginUserController, logoutUserController, getmeController } = require("../controllers/auth.controllers");
const auth_middleware = require("../middlewares/auth.middleware");
const AuthRouter = Router();
/**
 * @route POST
 */

AuthRouter.post("/register", userregisterController);
//Yeh sign up ka kaam sambhal lega

AuthRouter.post("/login", loginUserController);

//Abb humme yaahan ek route define karna hain for the logout waalon ke liya
AuthRouter.post("/logout", logoutUserController);
AuthRouter.get("/logout", logoutUserController);

//Abb humme ek route se user ki info ko fetch karna hain
AuthRouter.post("/get-me", auth_middleware, getmeController);
AuthRouter.get("/get-me", auth_middleware, getmeController);


module.exports = AuthRouter;