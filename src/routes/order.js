const express = require("express");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");
const router = express.Router();
const OrderController = require("../controllers/OrderController");

//CREATE ORDER- OK
router.post("/", verifyToken, OrderController.createOrder);

//UPDATE ORDER - OK
router.put("/:id", verifyToken, OrderController.updateOrder);

//DELETE ORDER
router.delete("/:id", verifyToken, OrderController.deleteOrder);

//DELETE ORDER
router.delete("/destroy/:id", verifyToken, OrderController.destroyOrder);

//PATCH
router.patch("/:id", verifyToken, OrderController.restoreOrder);

//GET USER ORDERS
router.get("/user-orders", verifyToken, OrderController.readUserOrders);

//GET ORDERS BY USERID
router.get(
  "/order-userid/:userId",
  verifyTokenAndAdmin,
  OrderController.readOrderByUserId
);

//GET ORDER DETAIL
router.get("/:id", verifyToken, OrderController.readOrderDetail);

//GET MONTHLY INCOME
router.get("/stats/income", verifyTokenAndAdmin, OrderController.readIncome);

//GET CARD INFORMATION
router.get(
  "/stats/card",
  verifyTokenAndAdmin,
  OrderController.readCardInformation
);

//GET ALL ORDERS
router.get("/", verifyTokenAndAdmin, OrderController.readAllOrders);

module.exports = router;
