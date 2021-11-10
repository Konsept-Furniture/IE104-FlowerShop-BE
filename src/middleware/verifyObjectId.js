const mongoose = require("mongoose");

const checkObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send("Invalid id");
  }
  next();
};

module.exports = checkObjectId;
