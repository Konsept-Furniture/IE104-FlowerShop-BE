const express = require("express");
const User = require("../models/User");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");
const router = express.Router();
const UserController = require("../controllers/UserController");

//UPDATE USER
//Chỉ update những user (deleted = fasle)
router.put("/:id", verifyTokenAndAuthorization, UserController.updateUser);

//DELETE USER
router.delete("/:id", verifyTokenAndAuthorization, UserController.deleteUser);

//GET USER
router.get("/:id", verifyTokenAndAdmin, UserController.readUser);

//GET ALL STATS
router.get(
  "/stats/month",
  verifyTokenAndAdmin,
  UserController.readUserStatistics
);
//GET ALL USER
router.get("/", verifyTokenAndAdmin, UserController.readAllUser);

module.exports = router;
