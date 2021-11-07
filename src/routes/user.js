const express = require("express");
const User = require("../models/User");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");
const router = express.Router();

//UPDATE USER
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  console.log("Check>>here");
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SECRET
    ).toString();
  }
  console.log("Check>>here");
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
});

//DELETE USER
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    console.log(req.params.id);
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json("User has been deleted...");
  } catch (error) {
    return res.status(500).json(error);
  }
});

//GET USER
router.get("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...orthers } = user._doc;
    return res.status(200).json(orthers);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//GET ALL STATS
router.get("/stats/month", verifyTokenAndAdmin, async (req, res) => {
  console.log(">>Check here");
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await User.aggregate([
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
    console.log(">>Check here");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
});
//GET ALL USER
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
