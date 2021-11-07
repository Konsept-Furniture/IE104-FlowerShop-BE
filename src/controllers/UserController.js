const User = require("../models/User");

class UserController {
  updateUser = async (req, res) => {
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
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  deleteUser = async (req, res) => {
    try {
      //Chưa có xóa hoàn toàn, có thể restore
      await User.delete({ _id: req.params.id });
      return res.status(200).json("User has been deleted...");
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  readUser = async (req, res) => {
    try {
      const user = await User.findOneWithDeleted({ _id: req.params.id });
      const { password, ...orthers } = user._doc;
      return res.status(200).json(orthers);
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  readAllUser = async (req, res) => {
    console.log("Here", req.query.deleted);
    let qDeleted = req.query.deleted;
    if (qDeleted === "false") {
      console.log("Oke");
    }
    try {
      const users = await User.findWithDeleted();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json(error);
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
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json(error);
    }
  };
}

module.exports = new UserController();
