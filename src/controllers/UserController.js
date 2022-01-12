const User = require("../model/user");
const Order = require("../model/order");
const CryptoJS = require("crypto-js");
const getPagination = require("../helper/getPagination");

class UserController {
  updateUser = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      const response = {
        errorCode: 404,
        message: "User does not exist...",
      };
      return res.json(response);
    }
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SECRET
      ).toString();
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      const response = {
        data: updatedUser,
        errorCode: 0,
        message: "Update user successfully",
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
  updateUserInformation = async (req, res) => {
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      const response = {
        errorCode: 404,
        message: "User does not exist...",
      };
      return res.json(response);
    }
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SECRET
      ).toString();
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      const response = {
        data: updatedUser,
        errorCode: 0,
        message: "Updated information successfully",
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
  restoreUser = async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.params.id, {
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
  deleteUser = async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (user) {
        console.log(req.params.id);
        await User.updateOne(
          { _id: req.params.id },
          {
            $set: { deleted: true, deletedAt: Date.now() },
          }
        );
        const response = {
          errorCode: 0,
          message: "The user has been put in the trash...",
        };
        return res.json(response);
      }
      const response = {
        errorCode: 404,
        message: "Not found user...",
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
  destroyUser = async (req, res) => {
    console.log("Come here");
    try {
      await User.findByIdAndDelete(req.params.id);
      const response = {
        errorCode: 0,
        message: "User has been deleted...",
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
  readUser = async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (!user) {
        const response = {
          errorCode: 404,
          message: "User does not exist...",
        };
        return res.json(response);
      }
      const { password, ...orthers } = user._doc;
      const response = {
        data: orthers,
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

  readUserInformation = async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user.id });
      if (!user) {
        const response = {
          errorCode: 404,
          message: "User does not exist...",
        };
        return res.json(response);
      }
      const { password, ...orthers } = user._doc;

      const ordersUser = await Order.find({
        userId: orthers._id.toString(),
      });

      let result = { ...orthers, orders: ordersUser };

      const response = {
        data: result,
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

  caculatorOrderCountAndAmount = (orders, userId) => {
    let orderCount = 0;
    let amountTotal = 0;

    orders.forEach((item) => {
      if (item.userId === userId) {
        orderCount++;
        // if (item.status === "DELIVERIED") {

        // }
        amountTotal += item.amount;
      }
    });

    return { orderCount, amountTotal };
  };
  readAllUser = async (req, res) => {
    let data;
    let filter = {};
    const { page, pageSize, orderBy, search, isOrder } = req.query;

    if (orderBy) {
      let arraySort = orderBy.split("-");
      filter = {
        [arraySort[0]]: arraySort[1],
      };
    }
    console.log({ isOrder });
    let qSearch = {
      $or: [
        {
          name: {
            $regex: new RegExp(search, "i") || "",
          },
        },
        {
          email: {
            $regex: new RegExp(search, "i") || "",
          },
        },
        {
          phone: {
            $regex: new RegExp(search, "i") || "",
          },
        },
      ],
    };

    const { limit, offset } = getPagination(page, pageSize);
    try {
      if (isOrder === "true" || isOrder === "false") {
        data = await User.paginate(
          {
            ...qSearch,
            deleted: false,
            isOrder,
          },
          {
            offset,
            limit,
            sort: filter,
          }
        );
      } else {
        data = await User.paginate(
          {
            ...qSearch,
            deleted: false,
          },
          {
            offset,
            limit,
            sort: filter,
          }
        );
      }

      let users = data.docs;

      //Get count order and total

      const orders = await Order.find();

      users = users.map((item, index) => {
        let newItem = this.caculatorOrderCountAndAmount(
          orders,
          item._id.toString()
        );
        return { ...item._doc, ...newItem };
      });

      // console.log("data users", users);
      // console.log("orders", orders);

      let pagination = {
        totalItems: data.totalDocs,
        totalPages: data.totalPages,
        currentPage: data.page,
        pageSize: +pageSize || 3,
      };

      const response = {
        data: users,
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
  readUserStatistics = async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try {
      const data = await User.aggregateWithDeleted([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      const response = {
        data: data,
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

module.exports = new UserController();
