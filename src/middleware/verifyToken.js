const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        const response = {
          errorCode: 403,
          message: "Token is not valid",
        };
        return res.json(response);
      }
      req.user = user;
      next();
    });
  } else {
    const response = {
      errorCode: 401,
      message: "You are not authenticated!",
    };
    return res.json(response);
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    // console.log("Come here");
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      const response = {
        errorCode: 403,
        message: "You are not allowed to do that!",
      };
      return res.json(response);
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      const response = {
        errorCode: 403,
        message: "You are not allowed to do that!",
      };
      return res.json(response);
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
