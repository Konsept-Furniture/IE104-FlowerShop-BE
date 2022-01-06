const Cart = require("../model/cart");
const Product = require("../model/product");

class CartController {
  createCart = async (req, res) => {
    req.body = {
      ...req.body,
      userId: req.user.id,
    };
    const newCart = new Cart(req.body);
    try {
      // console.log("Come here ", req.body);
      const savedCart = await newCart.save();
      const response = {
        data: savedCart,
        errorCode: 0,
        message: "Create cart successfully",
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
      const response = {
        data: updatedCart,
        errorCode: 0,
        message: "Update cart successfully",
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
  addItemToCart = async (req, res) => {
    try {
      //get data
      const { productId, quantity } = req.body;
      let item = { productId, quantity };

      //Check validate
      const cart = await Cart.findOne({ userId: req.user.id });
      if (cart._id.toString() !== req.params.id) {
        const response = {
          errorCode: 400,
          message: "Incorrect information",
        };
        return res.json(response);
      }

      //Xu li du lieu
      let oldProducts = cart.products;
      const filterProducts = oldProducts.filter(
        (product) => product.productId !== productId
      );

      let products = filterProducts.map((item) => {
        const p = {
          productId: item.productId,
          quantity: item.quantity,
        };
        return p;
      });

      let duplicate = [];
      duplicate = oldProducts.filter(
        (product) => product.productId === productId
      );

      if (duplicate.length > 0) {
        products = [
          ...products,
          {
            productId: duplicate[0].productId,
            quantity: Number(duplicate[0].quantity) + Number(quantity),
          },
        ];
      } else {
        products = [
          ...products,
          {
            productId: productId,
            quantity: quantity,
          },
        ];
      }

      const updatedCart = await Cart.findByIdAndUpdate(
        req.params.id,
        {
          $set: { products },
        },
        { new: true }
      );
      const response = {
        data: updatedCart,
        errorCode: 0,
        message: "Added item to cart successful",
      };
      return res.json(response);
    } catch (error) {
      const response = {
        errorCode: 500,
        message: error,
      };
      return res.json(response);
    }
  };
  deleteCart = async (req, res) => {
    try {
      // console.log(req.params.id);
      await Cart.findByIdAndDelete(req.params.id);
      const response = {
        errorCode: 0,
        message: "Cart has been deleted...",
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
  deleteCartItem = async (req, res) => {
    try {
      //get data
      const { productId } = req.body;
      let item = { productId };

      //Check validate
      const cart = await Cart.findOne({ userId: req.user.id });
      if (cart._id.toString() !== req.params.id) {
        const response = {
          errorCode: 400,
          message: "Incorrect information",
        };
        return res.json(response);
      }

      //Update
      const updatedCart = await Cart.findByIdAndUpdate(
        req.params.id,
        { $pull: { products: item } },
        { new: true }
      );

      const response = {
        data: updatedCart,
        errorCode: 0,
        message: "Delete Item Successfull",
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
  readUserCart = async (req, res) => {
    // console.log(">>Check get cart", req.params.userId);
    try {
      const cart = await Cart.findOne({ userId: req.user.id });

      let arrayFilterProduct = [];
      let arrayProduct = [];
      let arrayID = [];
      let quantity = [];
      cart.products.forEach((item) => {
        arrayID.push(item.productId);
        quantity.push(item.quantity);
      });

      const Products = await Product.find();
      // Products.forEach((item) => console.log(item._id.toString()));
      arrayFilterProduct = Products.filter((item) =>
        arrayID.includes(item._id.toString())
      );

      for (let i = 0; i < arrayID.length; i++) {
        arrayFilterProduct.forEach((item) => {
          if (item._id.toString() === arrayID[i]) {
            const newProduct = {
              ...item._doc,
              quantity: quantity[i],
            };
            arrayProduct.push(newProduct);
          }
        });
      }

      const response = {
        data: { ...cart._doc, products: arrayProduct },
        errorCode: 0,
        message: "Success",
      };

      // console.log(response.data);

      return res.json(response);
    } catch (err) {
      const response = {
        errorCode: 500,
        message: "Something went wrong, please try again",
      };
      return res.json(response);
    }
  };
  readAllCart = async (req, res) => {
    try {
      const carts = await Cart.find();
      const response = {
        data: carts,
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

module.exports = new CartController();
