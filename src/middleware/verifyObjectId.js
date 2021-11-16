const mongoose = require("mongoose");

const checkObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    const response = {
      errorCode: 400,
      message: "Invalid id",
    };
    return res.send(response);
  }
  next();
};

module.exports = checkObjectId;
