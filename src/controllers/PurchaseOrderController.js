const PurchaseOrder = require("../model/purchaseOrder");

class PurchaseOrderController {
  createPurchaseOrder = async (req, res) => {
    const newPurchaseOrder = new PurchaseOrder(req.body);
    try {
      // console.log("Come here ", req.body);
      const savedPurchaseOrder = await newPurchaseOrder.save();
      const response = {
        data: savedPurchaseOrder,
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
  updatePurchaseOrder = async (req, res) => {
    try {
      const updatedPurchaseOrder = await PurchaseOrder.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      const response = {
        data: updatedPurchaseOrder,
        errorCode: 0,
        message: "Success",
      };
      return res.json(response);
    } catch (error) {
      const response = {
        errorCode: 500,
        message: "Something went wrong, please try again",
      };
      return res.json(response);
    }
  };
  deletePurchaseOrder = async (req, res) => {
    try {
      // console.log(req.params.id);
      await PurchaseOrder.findByIdAndDelete(req.params.id);
      const response = {
        errorCode: 0,
        message: "PurchaseOrder has been deleted...",
      };
      return res.json(response);
    } catch (error) {
      const response = {
        errorCode: 500,
        message: "Something went wrong, please try again",
      };
      return res.json(response);
    }
  };
  readPurchaseOrder = async (req, res) => {
    try {
      const category = await PurchaseOrder.findById(req.params.id);
      const response = {
        data: category,
        errorCode: 0,
        message: "Success",
      };
      return res.json(response);
    } catch (error) {
      const response = {
        errorCode: 500,
        message: "Something went wrong, please try again",
      };
      return res.json(response);
    }
  };
  readAllPurchaseOrder = async (req, res) => {
    try {
      const categories = await PurchaseOrder.find();
      const response = {
        data: categories,
        errorCode: 0,
        message: "Success",
      };
      return res.json(response);
    } catch (error) {
      const response = {
        errorCode: 500,
        message: "Something went wrong, please try again",
      };
      return res.json(response);
    }
  };
}

module.exports = new PurchaseOrderController();
