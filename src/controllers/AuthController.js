const User = require("../model/user");
const Cart = require("../model/cart");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
class AuthControler {
  //[GET]
  register = async (req, res) => {
    try {
      //Phần check xem username có trong hệ thông chưa
      const user = await User.findOneWithDeleted({
        username: req.body.username,
      });
      if (user) {
        const response = {
          errorCode: 401,
          message: "Username already exists",
        };
        return res.json(response);
      }

      const newUser = new User({
        ...req.body,
        password: CryptoJS.AES.encrypt(
          req.body.password,
          process.env.PASS_SECRET
        ).toString(),
      });

      const savedUser = await newUser.save();
      const { password, ...orthers } = savedUser._doc;
      const content = {
        userId: orthers._id,
        products: [],
      };
      const newCart = new Cart(content);
      await newCart.save();
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
  login = async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        const response = {
          errorCode: 401,
          message: "Wrong User Name",
        };
        return res.json(response);
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
        const response = {
          errorCode: 401,
          message: "Wrong Password",
        };
        return res.json(response);
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
      const response = {
        data: {
          accessToken: accessToken,
          user: orthers,
        },
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
  checkToken = async (req, res) => {
    return res.json({
      errorCode: 0,
      message: "Success",
    });
  };
  changePassword = async (req, res) => {
    try {
      const user = await User.findOneWithDeleted({ _id: req.user.id });
      const { oldPassword, newPassword, confirmPassword } = req.body;

      const hashedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_SECRET
      );
      const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

      if (originalPassword != oldPassword) {
        const response = {
          errorCode: 401,
          message: "Wrong Password",
        };
        return res.json(response);
      }

      if (newPassword !== confirmPassword) {
        const response = {
          errorCode: 200,
          message: "Both new passwords are not matching",
        };
        return res.json(response);
      }

      let passwordCry = CryptoJS.AES.encrypt(
        newPassword,
        process.env.PASS_SECRET
      ).toString();

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: { password: passwordCry },
        },
        { new: true }
      );
      const response = {
        data: updatedUser,
        errorCode: 0,
        message: "Success",
      };
      return res.json(response);
    } catch (error) {
      const response = {
        errorCode: 500,
        message: "Something went wrong, please try again",
      };
      return res.json(response);
    }
  };
}

module.exports = new AuthControler();
