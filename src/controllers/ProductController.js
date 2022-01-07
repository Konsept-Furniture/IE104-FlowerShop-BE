const Product = require("../model/product");
const getPagination = require("../helper/getPagination");

class ProductController {
  createProduct = async (req, res) => {
    const newProduct = new Product(req.body);
    try {
      console.log(newProduct);
      const savedProduct = await newProduct.save();
      const response = {
        data: savedProduct,
        errorCode: 0,
        message: "Create product successfully",
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
  updateProduct = async (req, res) => {
    try {
      const object = { ...req.body };
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      console.log(updatedProduct);
      const response = {
        data: updatedProduct,
        errorCode: 0,
        message: "Update product successfully",
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
  restoreProduct = async (req, res) => {
    try {
      await Product.findByIdAndUpdate(req.params.id, {
        $set: { deleted: false, deletedAt: null },
      });
      const response = {
        errorCode: 0,
        message: "Restore successfully",
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
  deleteProduct = async (req, res) => {
    try {
      await Product.findByIdAndUpdate(req.params.id, {
        $set: { deleted: true, deletedAt: Date.now() },
      });
      const response = {
        errorCode: 0,
        message: "The product has been put in the trash...",
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
  destroyProduct = async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      const response = {
        errorCode: 0,
        message: "Product has been deleted...",
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
  readProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      const response = {
        data: product,
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
  readAllProductCategory = async (req, res) => {
    try {
      let data;
      let filter = {};
      const {
        page,
        pageSize,
        minPrice,
        maxPrice,
        category,
        orderBy,
        search,
        inStock,
      } = req.query;
      let condition = category
        ? {
            categories: {
              $in: [category],
            },
            price: {
              $gte: minPrice || 0,
              $lt: maxPrice || 1000,
            },
            deleted: false,
          }
        : {
            price: {
              $gte: minPrice || 0,
              $lt: maxPrice || 1000,
            },
            deleted: false,
          };
      let qSearch = {
        title: {
          $regex: new RegExp(search, "i") || "",
        },
      };
      condition = search ? { ...condition, ...qSearch } : condition;

      if (orderBy) {
        let arraySort = orderBy.split("-");
        filter = {
          [arraySort[0]]: arraySort[1],
        };
      }

      const { limit, offset } = getPagination(page, pageSize);

      if (inStock === "true") {
        data = await Product.paginate(
          {
            ...condition,
            inStock: true,
          },
          {
            offset,
            limit,
            sort: filter,
          }
        );
      } else if (inStock === "false") {
        data = await Product.paginate(
          {
            ...condition,
            inStock: false,
          },
          {
            offset,
            limit,
            sort: filter,
          }
        );
      } else {
        data = await Product.paginate(condition, {
          offset,
          limit,
          sort: filter,
        });
      }

      let products = data.docs;

      let pagination = {
        totalItems: data.totalDocs,
        totalPages: data.totalPages,
        currentPage: data.page,
        category: category,
        pageSize: +pageSize || 3,
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
        message: "Something went wrong, please try again",
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
        totalPages: data.totalPages,
        currentPage: data.page,
        pageSize: +pageSize || 3,
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
        message: "Something went wrong, please try again",
      };
      return res.json(response);
    }
  };
}

module.exports = new ProductController();
