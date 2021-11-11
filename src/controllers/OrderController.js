const Order = require("../models/order");

class OrderController {
  createOrder = async (req, res) => {
    const newOrder = new Order(req.body);
    try {
      console.log("Come here ", req.body);
      const savedOrder = await newOrder.save();
      return res.status(200).json(savedOrder);
    } catch (err) {
      return res.status(500).json(err);
    }
  };

  updateOrder = async (req, res) => {
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
  };

  restoreOrder = async (req, res) => {
    try {
      await Order.restore({ _id: req.params.id });
      return res.status(200).json("Resore successfully");
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  deleteOrder = async (req, res) => {
    try {
      // console.log(req.params.id);
      await Order.delete({ _id: req.params.id });
      return res.status(200).json("The order has been put in the trash...");
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  destroyOrder = async (req, res) => {
    try {
      await Order.deleteOne({ _id: req.params.id });
      return res.status(200).json("Order has been deleted...");
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  readUserOrders = async (req, res) => {
    // console.log(">>Check get order", req.params.userId);
    let qDeleted = req.query.deleted;
    // console.log("Check deleted ", qDeleted);
    try {
      const orders = qDeleted
        ? await Order.findDeleted({ userId: req.params.userId })
        : await Order.find({ userId: req.params.userId });
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  readAllOrders = async (req, res) => {
    let qDeleted = req.query.deleted;
    try {
      const orders = qDeleted ? await Order.findDeleted() : await Order.find();
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  readMonthlyIncome = async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(date.setMonth(lastMonth.getMonth() - 2));
    console.log("check lastmonth", lastMonth);
    console.log("check previous month", previousMonth);
    try {
      const income = await Order.aggregateWithDeleted([
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
  };
}

module.exports = new OrderController();
