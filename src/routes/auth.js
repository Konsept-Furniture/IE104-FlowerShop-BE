const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req, res) => {
  // console.log(req.body);

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SECRET
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();

    return res.status(201).json(savedUser);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(401).json("Wrong User Name");
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SECRET
    );
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    // console.log(">>Check pass", originalPassword);

    const inputPassword = req.body.password;
    // console.log(">>Check inputpass", inputPassword);

    if (originalPassword != inputPassword) {
      return res.status(401).json("Wrong Password");
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      }
    );
    const { password, ...orthers } = user._doc;
    return res.status(200).json({ ...orthers, accessToken });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
