const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const AuthControlller = require("../controllers/AuthController");
const AuthController = require("../controllers/AuthController");

//REGISTER
router.post("/register", AuthControlller.register);

//LOGIN
router.post("/login", AuthController.login);

module.exports = router;