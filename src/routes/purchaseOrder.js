const express = require("express");
const router = express.Router();
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");
const verifyObjectId = require("../middleware/verifyObjectId");
const PurchaseOrderController = require("../controllers/PurchaseOrderController");

//CREATE PurchaseOrder- OK
router.post(
  "/",
  verifyTokenAndAdmin,
  PurchaseOrderController.createPurchaseOrder
);

//UPDATE PurchaseOrder - OK
router.put(
  "/:id",
  verifyObjectId,
  verifyTokenAndAdmin,
  PurchaseOrderController.updatePurchaseOrder
);

//DELETE PurchaseOrder
router.delete(
  "/:id",
  verifyObjectId,
  verifyTokenAndAdmin,
  PurchaseOrderController.deletePurchaseOrder
);

//GET PurchaseOrder
router.get(
  "/:id",
  verifyTokenAndAdmin,
  PurchaseOrderController.readPurchaseOrder
);

//GET ALL PurchaseOrder
router.get(
  "/",
  verifyTokenAndAdmin,
  PurchaseOrderController.readAllPurchaseOrder
);

module.exports = router;
