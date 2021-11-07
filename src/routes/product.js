const express = require("express");
const Product = require("../models/Product");
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");
const router = express.Router();

//CREATE - OK
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    console.log("Come here ", req.body);
    const savedProduct = await newProduct.save();
    return res.status(200).json(savedProduct);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//UPDATE PRODUCT - OK
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  //   console.log("Check>>here", req.params.id);
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
});

//DELETE PRODUCT
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    console.log(req.params.id);
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json("Product has been deleted...");
  } catch (error) {
    return res.status(500).json(error);
  }
});

//GET PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//GET ALL PRODUCT
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
