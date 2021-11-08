const express = require("express");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");
const router = express.Router();
const OrderController = require("../controllers/OrderController");

//CREATE ORDER- OK
router.post("/", verifyToken, OrderController.createOrder);

//UPDATE ORDER - OK
router.put("/:id", verifyTokenAndAdmin, OrderController.updateOrder);

//DELETE ORDER
router.delete("/:id", verifyToken, OrderController.deleteOrder);

//PATCH
router.patch("/:id", verifyToken, OrderController.restoreOrder);

//GET USER ORDERS
router.get(
  "/:userId",
  verifyTokenAndAuthorization,
  OrderController.readUserOrders
);

//GET MONTHLY INCOME

router.get(
  "/stats/income",
  verifyTokenAndAdmin,
  OrderController.readMonthlyIncome
);

//GET ALL ORDERS
router.get("/", verifyTokenAndAdmin, OrderController.readAllOrders);

module.exports = router;
