const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
class AuthControler {
  //[GET]
  register = async (req, res) => {
    //Phần check xem username có trong hệ thông chưa
    // const user = await User.findOne({ username: req.body.username });

    // if (user) {
    //   return res.status(401).json("Username already exists");
    // }
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SECRET
      ).toString(),
      isAdmin: req.body.isAdmin,
    });
    try {
      const savedUser = await newUser.save();

      return res.status(201).json(savedUser);
    } catch (err) {
      return res.status(500).json(err);
    }
  };

  login = async (req, res) => {
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
  };
}

module.exports = new AuthControler();
