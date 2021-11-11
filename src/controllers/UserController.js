const User = require("../models/User");

class UserController {
  updateUser = async (req, res) => {
    const user = await User.findOneWithDeleted({ _id: req.params.id });
    if (!user) {
      return res.status(404).json("User does not exist...");
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
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  restoreUser = async (req, res) => {
    try {
      await User.restore({ _id: req.params.id });
      return res.status(200).json("Resore successfully");
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  deleteUser = async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (user) {
        await User.delete({ _id: req.params.id });
        return res.status(200).json("The user has been put in the trash...");
      }
      return res.status(404).json("Not found user...");
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  destroyUser = async (req, res) => {
    console.log("Come here");
    try {
      await User.deleteOne({ _id: req.params.id });
      return res.status(200).json("User has been deleted...");
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  readUser = async (req, res) => {
    try {
      const user = await User.findOneWithDeleted({ _id: req.params.id });
      if (!user) {
        return res.status(404).json("User does not exist...");
      }
      const { password, ...orthers } = user._doc;
      return res.status(200).json(orthers);
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  readAllUser = async (req, res) => {
    console.log("Here", req.query.deleted);
    let qDeleted = req.query.deleted;
    try {
      const users = qDeleted ? await User.findDeleted() : await User.find();
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
