const Order = require("../model/order");
const Cart = require("../model/cart");
const Product = require("../model/product");
const getPagination = require("../helper/getPagination");

class OrderController {
  createOrder = async (req, res) => {
    try {
      req.body = {
        ...req.body,
        userId: req.user.id,
      };
      const newOrder = new Order(req.body);
      const savedOrder = await newOrder.save();

      let products = req.body.products;
      const cart = await Cart.findOne({ userId: req.user.id });
      for (let i = 0; i < products.length; i++) {
        let item = { productId: products[i].productId };
        const updatedCart = await Cart.findByIdAndUpdate(
          cart._id.toString(),
          { $pull: { products: item } },
          { new: true }
        );
        console.log(updatedCart);
      }

      const response = {
        data: savedOrder,
        errorCode: 0,
        message: "Success",
      };
      return res.json(response);
    } catch (err) {
      const response = {
        errorCode: 500,
        message: "Something went wrong, please try again",
      };
      return res.json(response);
    }
  };
  updateOrder = async (req, res) => {
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
        message: "Something went wrong, please try again",
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
        message: "Something went wrong, please try again",
      };
      return res.json(response);
    }
  };
  deleteOrder = async (req, res) => {
    try {
      await Order.delete({ _id: req.params.id });
      const response = {
        errorCode: 0,
        message: "The order has been put in the trash...",
      };
      return res.json(response);
    } catch (err) {
      const response = {
        errorCode: 500,
        message: "Something went wrong, please try again",
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
        message: "Something went wrong, please try again",
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
        ? await Order.findDeleted({ userId: req.user.id }).sort({
            createdAt: "desc",
          })
        : await Order.find({ userId: req.user.id }).sort({
            createdAt: "desc",
          });

      const response = {
        data: orders,
        errorCode: 0,
        message: "Success",
      };
      return res.json(response);
    } catch (err) {
      const response = {
        errorCode: 500,
        message: "Something went wrong, please try again",
      };
      return res.json(response);
    }
  };
  readOrderDetail = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);

      if (order.userId !== req.user.id) {
        const response = {
          errorCode: 403,
          message: `You are not allowed to work with order with ID(${req.params.id})`,
        };
        return res.json(response);
      }

      let arrayFilterProduct = [];
      let arrayProduct = [];
      let arrayID = [];
      let orthers = [];
      order.products.forEach((item) => {
        arrayID.push(item.productId);
        orthers.push({
          quantity: item.quantity || 0,
          amount: item.quantity || 0,
        });
      });

      const Products = await Product.find();
      arrayFilterProduct = Products.filter((item) =>
        arrayID.includes(item._id.toString())
      );

      for (let i = 0; i < arrayID.length; i++) {
        arrayFilterProduct.forEach((item) => {
          if (item._id.toString() === arrayID[i]) {
            const newProduct = {
              ...orthers[i],
              productId: arrayID[i],
              img: item._doc.img,
              title: item._doc.title,
              price: item._doc.price,
            };
            arrayProduct.push(newProduct);
          }
        });
      }

      const response = {
        data: { ...order._doc, products: arrayProduct },
        errorCode: 0,
        message: "Success",
      };
      return res.json(response);
    } catch (err) {
      const response = {
        errorCode: 500,
        message: "Something went wrong, please try again",
      };
      return res.json(response);
    }
  };
  readAllOrders = async (req, res) => {
    // let qDeleted = req.query.deleted;

    try {
      const { page, pageSize } = req.query;
      const { limit, offset } = getPagination(page, pageSize);
      console.log(limit, offset);
      let data = await Order.paginate(
        {},
        {
          offset,
          limit,
        }
      );

      let orders = data.docs;

      let pagination = {
        totalItems: data.totalDocs,
        totalPages: data.totalPages,
        currentPage: data.page,
        pageSize: +pageSize || 3,
      };
      const response = {
        data: orders,
        pagination: pagination,
        errorCode: 0,
        message: "Success",
      };
      return res.json(response);
    } catch (err) {
      const response = {
        errorCode: 500,
        message: "Something went wrong, please try again",
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
        message: "Something went wrong, please try again",
      };
      return res.json(response);
    }
  };
}

module.exports = new OrderController();
