const express = require("express");
const router = express.Router();
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");
const verifyObjectId = require("../middleware/verifyObjectId");
const SupplierController = require("../controllers/SupplierController");

//CREATE Supplier- OK
router.post("/", verifyTokenAndAdmin, SupplierController.createSupplier);

//UPDATE Supplier - OK
router.put(
  "/:id",
  verifyObjectId,
  verifyTokenAndAdmin,
  SupplierController.updateSupplier
);

//DELETE Supplier
router.delete(
  "/:id",
  verifyObjectId,
  verifyTokenAndAdmin,
  SupplierController.deleteSupplier
);

//GET Supplier
router.get("/:id", verifyTokenAndAdmin, SupplierController.readSupplier);

//GET ALL Supplier
router.get("/", verifyTokenAndAdmin, SupplierController.readAllSupplier);

module.exports = router;
