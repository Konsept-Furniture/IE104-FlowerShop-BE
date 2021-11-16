const Product = require("../model/product");
const getPagination = require("../helper/getPagination");
class ProductController {
  createProduct = async (req, res) => {
    const newProduct = new Product(req.body);
    try {
      const savedProduct = await newProduct.save();
      const response = {
        data: savedProduct,
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
  updateProduct = async (req, res) => {
    try {
      const updatedProduct = await Product.findOneAndUpdateWithDeleted(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      const response = {
        data: updatedProduct,
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
  restoreProduct = async (req, res) => {
    try {
      await Product.restore({ _id: req.params.id });
      const response = {
        errorCode: 0,
        message: "Resore successfully",
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
  deleteProduct = async (req, res) => {
    console.log("Come here");
    try {
      await Product.delete({ _id: req.params.id });
      const response = {
        errorCode: 0,
        message: "The product has been put in the trash...",
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
  destroyProduct = async (req, res) => {
    try {
      await Product.deleteOne({ _id: req.params.id });
      const response = {
        errorCode: 0,
        message: "Product has been deleted...",
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

  readProduct = async (req, res) => {
    try {
      const product = await Product.findOne({ _id: req.params.id });
      const response = {
        data: product,
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

  readAllProductCategory = async (req, res) => {
    try {
      let data;
      const { page, pageSize } = req.query;
      const category = req.params.category;
      var condition = category
        ? {
            categories: {
              $in: [category],
            },
          }
        : {};
      const { limit, offset } = getPagination(page, pageSize);
      data = await Product.paginate(condition, { offset, limit });
      let products = data.docs;
      let pagination = {
        totalItems: data.totalDocs,
        totalPages: data.totalPages,
        currentPage: data.page,
        category: category,
        pageSize: pageSize,
      };
      const response = {
        data: products,
        pagination: pagination,
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

  readAllProduct = async (req, res) => {
    try {
      let data;
      const { page, pageSize } = req.query;
      const { limit, offset } = getPagination(page, pageSize);
      data = await Product.paginate({}, { offset, limit });
      let products = data.docs;

      let pagination = {
        totalItems: data.totalDocs,
        pageSize: pageSize,
        totalPages: data.totalPages,
        currentPage: data.page,
      };
      const response = {
        data: products,
        pagination: pagination,
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
}

module.exports = new ProductController();
