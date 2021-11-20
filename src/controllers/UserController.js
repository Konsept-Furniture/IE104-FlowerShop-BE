const User = require("../model/user");

class UserController {
  updateUser = async (req, res) => {
    const user = await User.findOneWithDeleted({ _id: req.params.id });
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
    } catch (error) {
      const response = {
        errorCode: 500,
        message: err,
      };
      return res.json(response);
    }
  };
  updateUserInformation = async (req, res) => {
    const user = await User.findOneWithDeleted({ _id: req.user.id });
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
    } catch (error) {
      const response = {
        errorCode: 500,
        message: err,
      };
      return res.json(response);
    }
  };

  restoreUser = async (req, res) => {
    try {
      await User.restore({ _id: req.params.id });
      const response = {
        errorCode: 0,
        message: "Resore successfully",
      };
      return res.json(response);
    } catch (error) {
      const response = {
        errorCode: 500,
        message: err,
      };
      return res.json(response);
    }
  };
  deleteUser = async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (user) {
        await User.delete({ _id: req.params.id });
        const response = {
          errorCode: 0,
          message: "The order has been put in the trash...",
        };
        return res.json(response);
      }
      const response = {
        errorCode: 404,
        message: "Not found user...",
      };
      return res.json(response);
    } catch (error) {
      const response = {
        errorCode: 500,
        message: err,
      };
      return res.json(response);
    }
  };

  destroyUser = async (req, res) => {
    console.log("Come here");
    try {
      await User.deleteOne({ _id: req.params.id });
      const response = {
        errorCode: 0,
        message: "User has been deleted...",
      };
      return res.json(response);
    } catch (error) {
      const response = {
        errorCode: 500,
        message: err,
      };
      return res.json(response);
    }
  };
  readUser = async (req, res) => {
    try {
      const user = await User.findOneWithDeleted({ _id: req.params.id });
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
    } catch (error) {
      const response = {
        errorCode: 500,
        message: err,
      };
      return res.json(response);
    }
  };
  readUserInformation = async (req, res) => {
    try {
      const user = await User.findOneWithDeleted({ _id: req.user.id });
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
    } catch (error) {
      const response = {
        errorCode: 500,
        message: err,
      };
      return res.json(response);
    }
  };
  readAllUser = async (req, res) => {
    console.log("Here", req.query.deleted);
    let qDeleted = req.query.deleted;
    try {
      const users = qDeleted ? await User.findDeleted() : await User.find();
      const response = {
        data: users,
        errorCode: 0,
        message: "Success",
      };
      return res.json(response);
    } catch (error) {
      const response = {
        errorCode: 500,
        message: err,
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
    } catch (error) {
      const response = {
        errorCode: 500,
        message: err,
      };
      return res.json(response);
    }
  };
}

module.exports = new UserController();
