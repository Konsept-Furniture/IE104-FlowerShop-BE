const Product = require("../models/Product");
class ProductController {
  createProduct = async (req, res) => {
    const newProduct = new Product(req.body);
    try {
      console.log("Come here ", req.body);
      const savedProduct = await newProduct.save();
      return res.status(200).json(savedProduct);
    } catch (err) {
      return res.status(500).json(err);
    }
  };
  updateProduct = async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      return res.status(200).json(updatedProduct);
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  restoreProduct = async (req, res) => {};
  deleteProduct = async (req, res) => {};
  destroyProduct = async (req, res) => {};
  readProduct = async (req, res) => {
    try {
      const product = await Product.findOne({ _id: req.params.id });
      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  readAllProduct = async (req, res) => {};
}

module.exports = new ProductController();
