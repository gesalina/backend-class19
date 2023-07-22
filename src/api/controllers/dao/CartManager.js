import { cartModel } from "../../models/cart.model.js";
import { productModel } from "../../models/product.model.js";

class cartManager {
  constructor() {
    this.error = "";
  }
  /**
   * Get the carts
   */
  getCarts = async () => {
    const carts = await cartModel.find().lean();
    return carts;
  };
  /**
   * Find a cart by ID
   */
  findCartById = async (cartId) => {
    const cart = await cartModel.find({ id: cartId });
    if (!cart || cart <= 0) {
      return (this.error = { error: "Cart not found" });
    }
    return cart;
  };
  /**
   * Create a new cart
   */
  createCart = async () => {
    const generateId = await this.createtId();
    const result = await cartModel.create({ id: generateId });
    return result;
  };
  /**
   * Get the products of a cart
   */
  getCartProduct = async (cartId) => {
    const cartProducts = await cartModel
      .find({ id: cartId })
      .select("products");
    if (!cartProducts || cartProducts.products <= 0)
      return (this.error = { error: "This cart dont have products" });
    return cartProducts;
  };
  /**
   * Delete a product from a specific cart
   */
  deleteProduct = async (cartId, productId) => {
    const productData = await productModel.findOne({ id: productId });
    const deleteProduct = await cartModel.updateOne(
      { id: cartId },
      { $pull: { products: { product: productData._id } } }
    );
    if (!deleteProduct || deleteProduct.modifiedCount == 0)
      return (this.error = {
        error: "That product does not exist in this cart",
      });
    return deleteProduct;
  };
  /**
   * Update the cart with a array of products
   */
  addProductCart = async (cartId, productId, quantity) => {
    const cart = await cartModel.findOne({ id: cartId });
    const productData = await productModel.findOne({ id: productId });
    if (!cart) {
      return (this.error = { error: "This cart does not exists" });
    }
    cart.products.push({ product: productData._id, quantity: quantity });
    return await cartModel.updateOne({ cartId }, cart);
  };
  /**
   * Update the quantity of a product in a specific cart
   */
  updateProductQuantity = async (cartId, productId, quantity) => {
    const cart = await cartModel.findOne({ id: cartId });
    const productData = await productModel.findOne({ id: productId });
    if (!cart) {
      return (this.error = { error: "Cant find that cart" });
    }
    return cartModel.updateOne(
      { id: cartId, "products.product": productData._id },
      { $inc: { "products.$.quantity": quantity } }
    );
  };
  /**
   * Delete all products from a cart
   */
  deleteAllProducts = async (cartId) => {
    const cart = await cartModel.findOne({ id: cartId });
    cartId = parseInt(cartId);
    if (!cart) {
      return (this.error = { error: "Cant find that cart" });
    }
    return await cartModel.updateOne(
      { id: cartId },
      { $set: { products: [] } }
    );
  };

  /**
   * Create a UNIQUE ID for each product
   */
  createtId = async () => {
    const getCartId = await this.getCarts();
    return getCartId.length === 0 ? 1 : getCartId.at(-1).id + 1;
  };
  /**
   * Add a new product to a new cart | OLDEST Function
   *
  updateCart = async (cartId, productId, quantity) => {
    let cart = await cartModel.findOne({ id: cartId });
    let search = cart.products.find(
      (products) => products.product === productId
    );
    if (isNaN(productId) || isNaN(quantity))
      return (this.error = {
        error: "The product or the quantity need be a number",
      });
    productId = parseInt(productId);
    if (cart && !search) {
      cart.products.push({ product: productId, quantity: quantity });
      return await cartModel.updateOne({ cartId }, cart);
    } else {
      return cartModel.updateOne(
        { id: cartId, "products.product": productId },
        { $inc: { "products.$.quantity": quantity } }
      );
    }
  };
  */
}
export default cartManager;
