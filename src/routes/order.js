const express = require("express");
const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");
const router = express.Router();
const OrderController = require("../controllers/OrderController");

//CREATE ORDER- OK
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    console.log("Come here ", req.body);
    const savedOrder = await newOrder.save();
    return res.status(200).json(savedOrder);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//UPDATE ORDER - OK
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  // console.log("Check>>here", req.params.id);
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//DELETE ORDER
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    console.log(req.params.id);
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    return res.status(200).json(deletedOrder);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//GET USER ORDERS
router.get("/:userId", verifyTokenAndAuthorization, async (req, res) => {
  console.log(">>Check get order", req.params.userId);
  try {
    const orders = await Order.find({ userId: req.params.userId });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//GET MONTHLY INCOME

router.get("/stats/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(date.setMonth(lastMonth.getMonth() - 2));
  console.log("check lastmonth", lastMonth);
  console.log("check previous month", previousMonth);
  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    return res.status(200).json(income);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//GET ALL ORDERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
