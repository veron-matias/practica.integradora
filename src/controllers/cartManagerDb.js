const CartModel = require("../models/cart.model.js");

class CartManagerDb {
  async createCart() {
    try {
      const newCart = new CartModel({ products: [] });
      await newCart.save();
      return newCart;
    } catch (err) {
      console.log("Error la crear cart:", err);
      throw err;
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await CartModel.findById(cartId)
        .populate("products.product")
        .exec();
      if (!cart) {
        console.log("No se encontro el carrito por id");
        throw "Cart not found";
      }
      console.log("Cart encontrado");
      console.log("cart:", cart);
      return cart;
    } catch (err) {
      console.log("Error al buscar cart por id:", err);
      throw err;
    }
  }

  async addToCart(cartId, productId, quantity) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        throw "Cart to update not found";
      }
      const productExists = cart.products.find(
        (product) => product.product.toString() == productId
      );
      if (productExists) {
        productExists.quantity = productExists.quantity + quantity;
      } else {
        cart.products.push({ product: productId, quantity: quantity });
      }
      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (err) {
      console.log("Error al agregar al cart:", err);
      throw err;
    }
  }

  // PROBAR
  async addProductsToCart(cartId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        throw "Cart to update not found";
      }
      const productsToSend = products.map((e) => {
        return { product: e._id, quantity: e.quantity || 1 };
      });
      productsToSend.forEach((product) => {
        const productExists = cart.products.find(
          (a) => a.product.toString() == product.product
        );
        if (productExists) {
          productExists.quantity = productExists.quantity + product.quantity;
        } else {
          cart.products.push(product);
        }
      });
      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (err) {
      console.log("Error al agregar al cart:", err);
      throw err;
    }
  }

  async deleteFromCart(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        throw "Cart to update not found";
      } else {
        cart.products = cart.products.filter((e) => e.product != productId);
        cart.markModified("products");
        await cart.save();
        return cart;
      }
    } catch (err) {
      console.log("Error al borrar producto de cart:", err);
      throw err;
    }
  }

  async deleteAllProductsFromCart(cartId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        throw "Cart to update not found";
      } else {
        cart.products = [];
        await cart.save();
        return cart;
      }
    } catch (err) {
      console.log("Error al limpiar  cart:", err);
      throw err;
    }
  }
}

module.exports = CartManagerDb;