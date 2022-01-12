const Order = require("../model/order");
const User = require("../model/user");
const Cart = require("../model/cart");
const Product = require("../model/product");
const getPagination = require("../helper/getPagination");
const { arrayMonthChar, arrayMonthNumber } = require("../helper/date");
const {
  compareLastMonth,
  sumSales,
  kFormatter,
} = require("../helper/compareLastMonth");
const { formatDataMonth, formatDataDay } = require("../helper/convertData");
const user = require("../model/user");
const pdfTemplate = require("../document/invoice");
const pdf = require("html-pdf");

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
    try {
      const orders = await Order.find({
        userId: req.user.id,
        deleted: false,
      }).sort({
        createdAt: "desc",
      });

      const Products = await Product.find();

      let array = [];

      orders.forEach((item) => {
        // console.log(item.userId);
        console.log("Come here map");
        let arrayProduct = this.getProductInfo(item, Products);
        array.push(arrayProduct);
      });

      console.log("array", array);

      const results = orders.map((item, index) => {
        console.log(item.userId);

        return { ...item._doc, products: array[index] };
      });

      const response = {
        data: results,
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

  readOrderByUserId = async (req, res) => {
    console.log(req.params);
    try {
      const orders = await Order.find({
        userId: req.params.userId,
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

      //Loop array orders
      order.products.forEach((item) => {
        arrayID.push(item.productId);
        orthers.push({
          quantity: item.quantity || 0,
          amount: item.amount || 0,
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

  getProductInfo = (order, products) => {
    let arrayFilterProduct = [];
    let arrayProduct = [];
    let arrayID = [];
    let orthers = [];

    //Loop array orders
    order.products.forEach((item) => {
      arrayID.push(item.productId);
      orthers.push({
        quantity: item.quantity || 0,
        amount: item.amount || 0,
      });
    });

    arrayFilterProduct = products.filter((item) =>
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

    // console.log(arrayProduct);
    // console.log({ ...order._doc, products: arrayProduct });
    return arrayProduct;
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

      let data;
      if (status) {
        console.log("Come here khong empty");
        data = await Order.paginate(
          {
            status,
            deleted: false,
          },
          {
            offset,
            limit,
            sort: filter,
          }
        );
      } else {
        console.log("Come here !== empty");
        data = await Order.paginate(
          {
            deleted: false,
          },
          {
            offset,
            limit,
            sort: filter,
          }
        );
      }

      let orders = data.docs;

      const Products = await Product.find();

      let array = [];

      orders.forEach((item) => {
        // console.log(item.userId);
        console.log("Come here map");
        let arrayProduct = this.getProductInfo(item, Products);
        array.push(arrayProduct);
      });

      console.log("array", array);

      const users = await User.find();
      // console.log(users);
      const results = orders.map((item, index) => {
        // console.log(item.userId);
        let user = users.filter((u) => u._id.toString() === item.userId);
        return { ...item._doc, user: user[0], products: array[index] };
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
    console.log(january);
    const januaryLastYear = new Date(date.setMonth(-12));

    //Date now
    const dateNow = new Date(`${arrayDate[2]}-${arrayDate[0]}-${arrayDate[1]}`);

    //Find seven days ago
    const dateNow7 = new Date(
      `${arrayDate[2]}-${arrayDate[0]}-${arrayDate[1]}`
    );
    const sevenDaysAgo = new Date(dateNow7.setDate(dateNow7.getDate() - 6));
    dateNow7.setDate(dateNow7.getDate() + 6);
    dateNow7.setFullYear(dateNow7.getFullYear() - 1);
    const dateNow7LastYear = new Date(dateNow7.setDate(dateNow7.getDate()));
    const sevenDaysAgoLastYear = new Date(
      dateNow7LastYear.setDate(dateNow7LastYear.getDate() - 6)
    );
    dateNow7LastYear.setDate(dateNow7LastYear.getDate() + 6);
    console.log("dateNow7", dateNow7);
    console.log("dateNow7LastYear", dateNow7LastYear);
    console.log("sevenDaysAgoLastYear", sevenDaysAgoLastYear);

    //Find 30 days ago
    const dateNow30 = new Date(
      `${arrayDate[2]}-${arrayDate[0]}-${arrayDate[1]}`
    );
    const _30DaysAgo = new Date(dateNow30.setDate(dateNow30.getDate() - 29));
    dateNow30.setDate(dateNow30.getDate() + 29);
    dateNow30.setFullYear(dateNow30.getFullYear() - 1);
    const dateNow30LastYear = new Date(dateNow30.setDate(dateNow30.getDate()));
    const _30DaysAgoLastYear = new Date(
      dateNow30LastYear.setDate(dateNow30LastYear.getDate() - 29)
    );
    dateNow30LastYear.setDate(dateNow30LastYear.getDate() + 29);
    console.log("dateNow30", dateNow30);
    console.log("dateNow30LastYear", dateNow30LastYear);
    console.log("_30DaysAgoLastYear", _30DaysAgoLastYear);

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

        const incomeWeekLastYear = await Order.aggregate([
          {
            $match: {
              createdAt: { $gte: sevenDaysAgoLastYear, $lte: dateNow7LastYear },
            },
          },
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
        dateNow.setDate(dateNow.getDate() + 6);
        // console.log(dateNow);
        const dataLastYear = formatDataDay(7, incomeWeekLastYear, dateNow);

        // console.log(dataLastYear);
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
        const incomeMonthLastYear = await Order.aggregate([
          {
            $match: {
              createdAt: {
                $gte: _30DaysAgoLastYear,
                $lte: dateNow30LastYear,
              },
            },
          },
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
        dateNow.setDate(dateNow.getDate() + 29);
        const dataLastYear = formatDataDay(30, incomeMonthLastYear, dateNow);
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
  readCardInformation = async (req, res) => {
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

    //Date now
    const dateNow = new Date(`${arrayDate[2]}-${arrayDate[0]}-01`);
    const dateLastMonth = new Date(dateNow.setMonth(dateNow.getMonth() - 1));
    dateNow.setMonth(dateNow.getMonth() + 1);

    console.log("dateNow", dateNow);
    console.log("dateLastMonth", dateLastMonth);

    try {
      const usersCurrentMonth = await User.find({
        createdAt: {
          $gte: dateNow,
        },
      });
      // const users = await User.find();
      const usersLastMonth = await User.find({
        createdAt: {
          $gte: dateLastMonth,
          $lte: dateNow,
        },
      });

      const ordersCurrentMonth = await Order.find({
        createdAt: {
          $gte: dateNow,
        },
      });
      const orders = await Order.find();
      const ordersLastMonth = await Order.find({
        createdAt: {
          $gte: dateLastMonth,
          $lte: dateNow,
        },
      });

      // const sales = sumSales(orders);
      const salesCurrentMonth = sumSales(ordersCurrentMonth);
      const salesLastMonth = sumSales(ordersLastMonth);

      const compareUser = compareLastMonth(
        usersCurrentMonth.length,
        usersLastMonth.length
      );
      const compareOrder = compareLastMonth(
        ordersCurrentMonth.length,
        ordersLastMonth.length
      );
      const compareSales = compareLastMonth(salesCurrentMonth, salesLastMonth);

      // console.log(usersCurrentMonth.length);
      // console.log(users.length);
      // console.log(usersLastMonth.length);
      // console.log(compareUser.toFixed(1));
      // console.log(sales);

      response = {
        data: {
          dataMenu: [
            {
              label: "Total Customer",
              value: kFormatter(usersCurrentMonth.length),
              compareLastMonth: compareUser,
            },
            {
              label: "Total Orders",
              value: ordersCurrentMonth.length,
              compareLastMonth: compareOrder,
            },
            {
              label: "Sales",
              value: `$${kFormatter(salesCurrentMonth)}`,
              compareLastMonth: compareSales,
            },
          ],
        },
        errorCode: 0,
        message: "Success",
      };

      return res.json(respones);
    } catch (error) {
      return res.json(response);
    }
  };

  generatePDF = (req, res) => {
    console.log("come here");
    const options = {
      format: "A4",
    };
    let data = {
      order: {
        name: "Đinh Huỳnh Thái Bình",
        orderId: "999999999999",
        phone: "0814251252",
        address: "Ấp Đồng Ky Xã Quốc Thái Huyện An Phú Tỉnh An Giang",
      },
    };
    pdf
      .create(pdfTemplate(data), options)
      .toFile(`${__dirname}/result.pdf`, (err) => {
        if (err) {
          res.send(Promise.reject());
        }
        console.log("Success");
        res.send(Promise.resolve());
      });
  };

  fetchPDF = async (req, res) => {
    console.log("come here");
    const options = {
      format: "A4",
    };
    let response = {
      errorCode: 500,
      message: "Something went wrong, please try again",
    };
    const order = await Order.findById(req.params.orderId);
    let arrayFilterProduct = [];
    let arrayProduct = [];
    let arrayID = [];
    let orthers = [];

    //Loop array orders
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
    let data = {
      order: { ...order._doc, products: arrayProduct },
    };
    pdf
      .create(pdfTemplate(data), options)
      .toFile(`${__dirname}/result.pdf`, (err) => {
        if (err) {
          return res.json(response);
        }
        console.log("Success");
        res.sendFile(`${__dirname}/result.pdf`);
      });
  };
}

module.exports = new OrderController();
