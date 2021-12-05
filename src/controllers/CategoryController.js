const Category = require("../model/category");

class CategoryController {
  createCategory = async (req, res) => {
    const newCategory = new Category(req.body);
    try {
      // console.log("Come here ", req.body);
      const savedCategory = await newCategory.save();
      const response = {
        data: savedCategory,
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
  updateCategory = async (req, res) => {
    //   console.log("Check>>here", req.params.id);
    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      const response = {
        data: updatedCategory,
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
  deleteCategory = async (req, res) => {
    try {
      // console.log(req.params.id);
      await Category.findByIdAndDelete(req.params.id);
      const response = {
        errorCode: 0,
        message: "Category has been deleted...",
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
  readCategory = async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      const response = {
        data: category,
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
  readAllCategory = async (req, res) => {
    try {
      const categories = await Category.find();
      const response = {
        data: categories,
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
}

module.exports = new CategoryController();
