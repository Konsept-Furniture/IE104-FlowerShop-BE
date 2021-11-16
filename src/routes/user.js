const express = require("express");
const {
  verifyTokenAndAdmin,
  verifyToken,
} = require("../middleware/verifyToken");
const verifyObjectId = require("../middleware/verifyObjectId");
const router = express.Router();
const UserController = require("../controllers/UserController");

//UPDATE USER
//Chỉ update những user (deleted = fasle)
router.put(
  "/:id",
  verifyObjectId,
  verifyTokenAndAdmin,
  UserController.updateUser
);

//UPDATE USER PERSONAL
router.put("/update/infor", verifyObjectId, verifyToken, UserController.updateUserInformation);

//RESTORE USER
router.patch(
  "/:id",
  verifyObjectId,
  verifyTokenAndAdmin,
  UserController.restoreUser
);

//DELETE USER
router.delete(
  "/:id",
  verifyObjectId,
  verifyTokenAndAdmin,
  UserController.deleteUser
);

//DESTROY USER
router.delete(
  "/destroy/:id",
  verifyObjectId,
  verifyTokenAndAdmin,
  UserController.destroyUser
);

//GET USER
router.get(
  "/:id",
  verifyObjectId,
  verifyTokenAndAdmin,
  UserController.readUser
);

//GET USER INFORMATION
router.get(
  "/read/infor",
  verifyObjectId,
  verifyToken,
  UserController.readUserInformation
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
