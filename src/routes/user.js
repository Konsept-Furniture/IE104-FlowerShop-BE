const express = require("express");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");
const verifyObjectId = require("../middleware/verifyObjectId");
const router = express.Router();
const UserController = require("../controllers/UserController");

//UPDATE USER
//Chỉ update những user (deleted = fasle)
router.put(
  "/:id",
  verifyObjectId,
  verifyTokenAndAuthorization,
  UserController.updateUser
);

//DELETE USER
router.delete(
  "/:id",
  verifyObjectId,
  verifyTokenAndAuthorization,
  UserController.deleteUser
);

//GET USER
router.get(
  "/:id",
  verifyObjectId,
  verifyTokenAndAdmin,
  UserController.readUser
);

//GET ALL STATS
router.get(
  "/stats/month",
  verifyTokenAndAdmin,
  UserController.readUserStatistics
);
//GET ALL USER
router.get("/", verifyTokenAndAdmin, UserController.readAllUser);

module.exports = router;
