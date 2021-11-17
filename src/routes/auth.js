const router = require("express").Router();
const AuthController = require("../controllers/AuthController");
const { verifyToken } = require("../middleware/verifyToken");

//REGISTER
router.post("/register", AuthController.register);

//LOGIN
router.post("/login", AuthController.login);

//CHECK TOKEN
router.post("/check-token", verifyToken, AuthController.checkToken);

module.exports = router;
