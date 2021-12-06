const router = require("express").Router();
const AuthController = require("../controllers/AuthController");
const { verifyToken } = require("../middleware/verifyToken");

//REGISTER
router.post("/register", AuthController.register);

//LOGIN
router.post("/login", AuthController.login);

//LOGOUT
router.get("/logout", verifyToken, AuthController.logout);

//CHANGE PASSWORD
router.put("/change-password", verifyToken, AuthController.changePassword);

//CHECK TOKEN
router.post("/check-token", verifyToken, AuthController.checkToken);

module.exports = router;
