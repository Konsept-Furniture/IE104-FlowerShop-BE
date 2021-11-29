const express = require("express");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");
const verifyObjectId = require("../middleware/verifyObjectId");
const router = express.Router();
const CartController = require("../controllers/CartController");
//CREATE CART- OK
router.post("/", verifyToken, CartController.createCart);

//ADD ITEM TO CART - OK
router.put("/add-item/:id", verifyToken, CartController.addItemToCart);

//UPDATE CART - OK
router.put("/:id", verifyObjectId, verifyToken, CartController.updateCart);

//DELETE CART ITEM
router.delete("/delete/:id", verifyToken, CartController.deleteCartItem);

//DELETE CART
router.delete(
  "/:id",
  verifyObjectId,
  verifyTokenAndAdmin,
  CartController.deleteCart
);

//GET USER CART
router.get("/readUserCart", verifyToken, CartController.readUserCart);

//GET ALL CART
router.get("/", verifyTokenAndAdmin, CartController.readAllCart);

module.exports = router;
