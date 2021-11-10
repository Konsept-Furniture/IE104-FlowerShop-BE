const express = require("express");
const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");
const verifyObjectId = require("../middleware/verifyObjectId");
const router = express.Router();
const CartController = require("../controllers/CartController");
//CREATE CART- OK
router.post("/", verifyToken, CartController.createCart);

//UPDATE CART - OK
router.put(
  "/:id",
  verifyObjectId,
  verifyTokenAndAuthorization,
  CartController.updateCart
);

//DELETE CART
router.delete(
  "/:id",
  verifyObjectId,
  verifyTokenAndAuthorization,
  CartController.deleteCart
);

//GET USER CART
router.get(
  "/:userId",
  verifyTokenAndAuthorization,
  CartController.readUserCart
);

//GET ALL CART
router.get("/", verifyTokenAndAdmin, CartController.readAllCart);

module.exports = router;
