const model = require("../models/index");

class UserController {
  async show(req, res) {
    try {
      let data = await model.User.findAll();
      return res.json(data);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new UserController();
