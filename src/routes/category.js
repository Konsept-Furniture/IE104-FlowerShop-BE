const express = require("express");
const router = express.Router();
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");
const verifyObjectId = require("../middleware/verifyObjectId");
const CategoryController = require("../controllers/CategoryController");

//CREATE CATEGORY- OK
router.post("/", verifyTokenAndAdmin, CategoryController.createCategory);

//UPDATE CATEGORY - OK
router.put(
  "/:id",
  verifyObjectId,
  verifyTokenAndAdmin,
  CategoryController.updateCategory
);

//DELETE CATEGORY
router.delete(
  "/:id",
  verifyObjectId,
  verifyTokenAndAdmin,
  CategoryController.deleteCategory
);

//GET CATEGORY
router.get("/:id", verifyTokenAndAdmin, CategoryController.readCategory);

//GET ALL CATEGORY
router.get("/", verifyTokenAndAdmin, CategoryController.readAllCategory);

module.exports = router;
