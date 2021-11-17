const User = require("../model/user");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
class AuthControler {
  //[GET]
  register = async (req, res) => {
    //Phần check xem username có trong hệ thông chưa
    const user = await User.findOneWithDeleted({ username: req.body.username });
    if (user) {
      const response = {
        errorCode: 401,
        message: "Username already exists",
      };
      return res.json(response);
    }
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
      const { password, ...orthers } = savedUser;
      const response = {
        data: orthers,
        errorCode: 201,
        message: "Success",
      };
      return res.json(response);
    } catch (err) {
      const response = {
        errorCode: 500,
        message: err,
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
        message: err,
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
}

module.exports = new AuthControler();
