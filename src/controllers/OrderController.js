const Order = require("../model/order");

class OrderController {
  createOrder = async (req, res) => {
    const newOrder = new Order(req.body);
    try {
      const savedOrder = await newOrder.save();
      const response = {
        data: savedOrder,
        errorCode: 0,
        message: "Create order successfully",
      };
      return res.json(response);
    } catch (err) {
      const response = {
        errorCode: 500,
        message: err,
      };
      return res.json(response);
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
      const response = {
        data: updatedOrder,
        errorCode: 0,
        message: "Success",
      };
      return res.json(response);
    } catch (err) {
      const response = {
        errorCode: 500,
        message: err,
      };
      return res.json(response);
    }
  };

  restoreOrder = async (req, res) => {
    try {
      await Order.restore({ _id: req.params.id });
      const response = {
        errorCode: 0,
        message: "Resore successfully",
      };
      return res.json(response);
    } catch (err) {
      const response = {
        errorCode: 500,
        message: err,
      };
      return res.json(response);
    }
  };

  deleteOrder = async (req, res) => {
    try {
      // console.log(req.params.id);
      await Order.delete({ _id: req.params.id });
      const response = {
        errorCode: 0,
        message: "The order has been put in the trash...",
      };
      return res.json(response);
    } catch (err) {
      const response = {
        errorCode: 500,
        message: err,
      };
      return res.json(response);
    }
  };

  destroyOrder = async (req, res) => {
    try {
      await Order.deleteOne({ _id: req.params.id });
      const response = {
        errorCode: 0,
        message: "Order has been deleted...",
      };
      return res.json(response);
    } catch (err) {
      const response = {
        errorCode: 500,
        message: err,
      };
      return res.json(response);
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
      const response = {
        data: orders,
        errorCode: 0,
        message: "Success",
      };
      return res.json(response);
    } catch (err) {
      const response = {
        errorCode: 500,
        message: err,
      };
      return res.json(response);
    }
  };

  readAllOrders = async (req, res) => {
    let qDeleted = req.query.deleted;
    try {
      const orders = qDeleted ? await Order.findDeleted() : await Order.find();
      const response = {
        data: orders,
        errorCode: 0,
        message: "Success",
      };
      return res.json(response);
    } catch (err) {
      const response = {
        errorCode: 500,
        message: err,
      };
      return res.json(response);
    }
  };

  readMonthlyIncome = async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(date.setMonth(lastMonth.getMonth() - 2));
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
      const response = {
        data: income,
        errorCode: 0,
        message: "Success",
      };
      return res.json(response);
    } catch (err) {
      const response = {
        errorCode: 500,
        message: err,
      };
      return res.json(response);
    }
  };
}

module.exports = new OrderController();
