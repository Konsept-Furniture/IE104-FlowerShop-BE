const jwtHelper = require("../helpers/jwt.helper");
const debug = console.log.bind(console);

let tokenList = {};

const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "15m";
const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET || "access-token-secret";
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "365d";
const refreshTokenSecret =
  process.env.REFRESH_TOKEN_SECRET || "refresh-token-secret";

let login = async (req, res) => {
  try {
    debug(
      `Đang giả lập hành động đăng nhập thành công với Email: ${req.body.email} và Password: ${req.body.password}`
    );
    // Mình sẽ comment mô tả lại một số bước khi làm thực tế cho các bạn như sau nhé:
    // - Đầu tiên Kiểm tra xem email người dùng đã tồn tại trong hệ thống hay chưa?
    // - Nếu chưa tồn tại thì reject: User not found.
    // - Nếu tồn tại user thì sẽ lấy password mà user truyền lên, băm ra và so sánh với mật khẩu của user lưu trong Database
    // - Nếu password sai thì reject: Password is incorrect.
    // - Nếu password đúng thì chúng ta bắt đầu thực hiện tạo mã JWT và gửi về cho người dùng.
    // Trong ví dụ demo này mình sẽ coi như tất cả các bước xác thực ở trên đều ok, mình chỉ xử lý phần JWT trở về sau thôi nhé:
    const userFakeData = {
      _id: "1234-5678-910JQK-tqd",
      name: "Trung Quân",
      email: req.body.email,
    };
    const accessToken = await jwtHelper.generateToken(
      userFakeData,
      accessTokenSecret,
      accessTokenLife
    );
    const refreshToken = await jwtHelper.generateToken(
      userFakeData,
      refreshTokenSecret,
      refreshTokenLife
    );
    tokenList[refreshToken] = { accessToken, refreshToken };
    return res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    return res.status(500).json(error);
  }
};

let refreshToken = async (req, res) => {
  const refreshTokenFromClient = req.body.refreshToken;
  if (refreshTokenFromClient && tokenList[refreshTokenFromClient]) {
    try {
      const decoded = await jwtHelper.verifyToken(
        refreshTokenFromClient,
        refreshTokenSecret
      );
      const userFakeData = decoded.data;
      const accessToken = await jwtHelper.generateToken(
        userFakeData,
        accessTokenSecret,
        accessTokenLife
      );
      return res.status(200).json({ accessToken });
    } catch (error) {
      res.status(403).json({
        message: "Invalid refresh token.",
      });
    }
  } else {
    // Không tìm thấy token trong request
    return res.status(403).send({
      message: "No token provided.",
    });
  }
};

module.exports = {
  login: login,
  refreshToken: refreshToken,
};
