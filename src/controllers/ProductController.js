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
      const updatedProduct = await Product.findOneAndUpdateWithDeleted(
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
  restoreProduct = async (req, res) => {
    try {
      await Product.restore({ _id: req.params.id });
      return res.status(200).json("Resore successfully");
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  deleteProduct = async (req, res) => {
    console.log("Come here");
    try {
      await Product.delete({ _id: req.params.id });
      return res.status(200).json("The product has been put in the trash...");
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  destroyProduct = async (req, res) => {
    try {
      await Product.deleteOne({ _id: req.params.id });
      return res.status(200).json("Product has been deleted...");
    } catch (error) {
      return res.status(500).json(error);
    }
  };

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
