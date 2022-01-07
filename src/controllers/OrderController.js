const Order = require("../model/order");
const User = require("../model/user");
const Cart = require("../model/cart");
const Product = require("../model/product");
const getPagination = require("../helper/getPagination");
const { arrayMonthChar, arrayMonthNumber } = require("../helper/date");
const { formatDataMonth, formatDataDay } = require("../helper/convertData");

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
        message: "Create order successfully",
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
      await Order.findByIdAndUpdate(req.params.id, {
        $set: { deleted: false, deletedAt: null },
      });

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
      await Order.findByIdAndUpdate(req.params.id, {
        $set: { deleted: true, deletedAt: Date.now() },
      });
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
      await Order.findByIdAndDelete(req.params.id);
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
    console.log(">>Check get order");
    // let qDeleted = req.query.deleted;
    // console.log("Check deleted ", qDeleted);
    try {
      const orders = await Order.find({
        userId: req.user.id,
        deleted: false,
      }).sort({
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
      const user = await User.findById(req.user.id);

      console.log(!user.isAdmin);

      if (!user.isAdmin) {
        if (order.userId !== req.user.id) {
          const response = {
            errorCode: 403,
            message: `You are not allowed to work with order with ID(${req.params.id})`,
          };
          return res.json(response);
        }
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
      const { page, pageSize, orderBy, status } = req.query;
      const { limit, offset } = getPagination(page, pageSize);

      let filter = {};
      if (orderBy) {
        let arraySort = orderBy.split("-");
        filter = {
          [arraySort[0]]: arraySort[1],
        };
      }

      console.log(filter);
      let data = await Order.paginate(
        {
          status,
        },
        {
          offset,
          limit,
          sort: filter,
        }
      );

      let orders = data.docs;

      const users = await User.find();
      // console.log(users);
      const results = orders.map((item) => {
        // console.log(item.userId);
        let user = users.filter((u) => u._id.toString() === item.userId);
        return { ...item._doc, user: user[0] };
      });

      let pagination = {
        totalItems: data.totalDocs,
        totalPages: data.totalPages,
        currentPage: data.page,
        pageSize: +pageSize || 3,
      };

      // results.map((e) => console.log(e));

      const response = {
        data: results,
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
  readIncome = async (req, res) => {
    let { type } = req.query;
    let response = {
      errorCode: 500,
      message: "Something went wrong, please try again",
    };
    const currentDate = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Bangkok",
    });
    //Check date
    // console.log(currentDate);
    //Slpit Day Month Year [Month,Day,Year]
    const splitDate = currentDate.split(",");
    const arrayDate = splitDate[0].split("/");
    arrayDate[0] =
      arrayDate[0].length === 2 ? arrayDate[0] : "0" + arrayDate[0];
    arrayDate[1] =
      arrayDate[1].length === 2 ? arrayDate[1] : "0" + arrayDate[1];

    const date = new Date(`${arrayDate[2]}-${arrayDate[0]}-01`);
    //Check date
    // console.log(date);
    const january = new Date(date.setMonth(0));
    const januaryLastYear = new Date(date.setMonth(-12));

    //Date now
    const dateNow = new Date(`${arrayDate[2]}-${arrayDate[0]}-${arrayDate[1]}`);

    //Find seven days ago
    const dateNow7 = new Date(
      `${arrayDate[2]}-${arrayDate[0]}-${arrayDate[1]}`
    );
    const sevenDaysAgo = new Date(dateNow7.setDate(dateNow7.getDate() - 6));

    //Find seven days ago
    const dateNow30 = new Date(
      `${arrayDate[2]}-${arrayDate[0]}-${arrayDate[1]}`
    );
    const _30DaysAgo = new Date(dateNow30.setDate(dateNow30.getDate() - 29));

    // console.log(_30DaysAgo);
    // console.log(sevenDaysAgo);
    try {
      if (type === "year") {
        const incomeThisYear = await Order.aggregate([
          { $match: { createdAt: { $gte: january } } },
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
        const incomeLastYear = await Order.aggregate([
          {
            $match: {
              createdAt: { $gte: januaryLastYear, $lte: january },
            },
          },
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

        const dataThisYear = formatDataMonth(arrayDate[0], incomeThisYear);
        const dataLastYear = formatDataMonth(arrayDate[0], incomeLastYear);
        response = {
          data: {
            datasets: [
              {
                ordinal: 1,
                data: dataThisYear.data,
                label: "This year",
              },
              {
                ordinal: 2,
                data: dataLastYear.data,
                label: "Last year",
              },
            ],
            labels: dataLastYear.labels,
          },
          errorCode: 0,
          message: "Success",
        };
        return res.json(response);
      } else if (type === "week") {
        const incomeWeek = await Order.aggregate([
          { $match: { createdAt: { $gte: sevenDaysAgo } } },
          {
            $project: {
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
              year: { $year: "$createdAt" },
              sales: "$amount",
            },
          },
          {
            $group: {
              //  _id: "$month",
              _id: {
                day: "$day",
                // month: "$month",
                // year: "$year",
              },
              total: { $sum: "$sales" },
            },
          },
        ]);

        const dataThisYear = formatDataDay(7, incomeWeek, dateNow);
        response = {
          data: {
            datasets: [
              {
                ordinal: 1,
                data: dataThisYear.data,
                label: "This year",
              },
            ],
            labels: dataThisYear.labels,
          },
          errorCode: 0,
          message: "Success",
        };
      } else if (type === "month") {
        const incomeMonth = await Order.aggregate([
          { $match: { createdAt: { $gte: _30DaysAgo } } },
          {
            $project: {
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
              year: { $year: "$createdAt" },
              sales: "$amount",
            },
          },
          {
            $group: {
              //  _id: "$month",
              _id: {
                day: "$day",
                month: "$month",
                year: "$year",
              },
              total: { $sum: "$sales" },
            },
          },
        ]);
        const dataThisYear = formatDataDay(30, incomeMonth, dateNow);
        response = {
          data: {
            datasets: [
              {
                ordinal: 1,
                data: dataThisYear.data,
                label: "This year",
              },
            ],
            labels: dataThisYear.labels,
          },
          errorCode: 0,
          message: "Success",
        };
      }

      return res.json(response);
    } catch (err) {
      console.log("Come error");
      const response = {
        errorCode: 500,
        message: "Something went wrong, please try again",
      };
      return res.json(response);
    }
  };
}

module.exports = new OrderController();
