const express = require("express");
const Product = require("../models/Product");
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");
const verifyObjectId = require("../middleware/verifyObjectId");
const router = express.Router();
const ProductController = require("../controllers/ProductController");

//CREATE - OK
router.post("/", verifyTokenAndAdmin, ProductController.createProduct);

//UPDATE PRODUCT - OK
router.put("/:id", verifyTokenAndAdmin, ProductController.updateProduct);

//RESTORE PRODUCT - OK
router.patch("/:id", verifyTokenAndAdmin, ProductController.restoreProduct);

//DELETE PRODUCT
router.delete("/:id", verifyTokenAndAdmin, ProductController.deleteProduct);

//DESTROY PRODUCT
router.delete(
  "/destroy/:id",
  verifyTokenAndAdmin,
  ProductController.destroyProduct
);

//GET PRODUCT
router.get("/:id", verifyObjectId, ProductController.readProduct);

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
