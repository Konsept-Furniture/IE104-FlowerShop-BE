const Cart = require("../models/Cart");

class CartController {
  createCart = async (req, res) => {
    const newCart = new Cart(req.body);
    try {
      // console.log("Come here ", req.body);
      const savedCart = await newCart.save();
      return res.status(200).json(savedCart);
    } catch (err) {
      return res.status(500).json(err);
    }
  };
  updateCart = async (req, res) => {
    //   console.log("Check>>here", req.params.id);
    try {
      const updatedCart = await Cart.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      return res.status(200).json(updatedCart);
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  deleteCart = async (req, res) => {
    try {
      // console.log(req.params.id);
      await Cart.findByIdAndDelete(req.params.id);
      return res.status(200).json("Cart has been deleted...");
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  readUserCart = async (req, res) => {
    console.log(">>Check get cart", req.params.userId);
    try {
      const cart = await Cart.find({ userId: req.params.userId });
      return res.status(200).json(cart);
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  readAllCart = async (req, res) => {
    try {
      const carts = await Cart.find();
      res.status(200).json(carts);
    } catch (error) {
      return res.status(500).json(error);
    }
  };
}

module.exports = new CartController();
