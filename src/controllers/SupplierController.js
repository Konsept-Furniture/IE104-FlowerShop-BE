const Supplier = require("../model/supplier");

class SupplierController {
  createSupplier = async (req, res) => {
    const newSupplier = new Supplier(req.body);
    try {
      // console.log("Come here ", req.body);
      const savedSupplier = await newSupplier.save();
      const response = {
        data: savedSupplier,
        errorCode: 0,
        message: "Success",
      };
      return res.json(response);
    } catch (err) {
      const response = {
        errorCode: 500,
        message: JSON.stringify(err),
      };
      return res.json(response);
    }
  };
  updateSupplier = async (req, res) => {
    //   console.log("Check>>here", req.params.id);
    try {
      const updatedSupplier = await Supplier.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      const response = {
        data: updatedSupplier,
        errorCode: 0,
        message: "Success",
      };
      return res.json(response);
    } catch (error) {
      const response = {
        errorCode: 500,
        message: JSON.stringify(err),
      };
      return res.json(response);
    }
  };
  deleteSupplier = async (req, res) => {
    try {
      // console.log(req.params.id);
      await Supplier.findByIdAndDelete(req.params.id);
      const response = {
        errorCode: 0,
        message: "Supplier has been deleted...",
      };
      return res.json(response);
    } catch (error) {
      const response = {
        errorCode: 500,
        message: JSON.stringify(err),
      };
      return res.json(response);
    }
  };
  readSupplier = async (req, res) => {
    try {
      const category = await Supplier.findById(req.params.id);
      const response = {
        data: category,
        errorCode: 0,
        message: "Success",
      };
      return res.json(response);
    } catch (error) {
      const response = {
        errorCode: 500,
        message: JSON.stringify(err),
      };
      return res.json(response);
    }
  };
  readAllSupplier = async (req, res) => {
    try {
      const categories = await Supplier.find();
      const response = {
        data: categories,
        errorCode: 0,
        message: "Success",
      };
      return res.json(response);
    } catch (error) {
      const response = {
        errorCode: 500,
        message: JSON.stringify(err),
      };
      return res.json(response);
    }
  };
}

module.exports = new SupplierController();
