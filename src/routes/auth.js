const router = require("express").Router();
const AuthController = require("../controllers/AuthController");


//REGISTER
router.post("/register", AuthController.register);

//LOGIN
router.post("/login", AuthController.login);

module.exports = router;