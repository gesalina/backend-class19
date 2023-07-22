import { profile } from "console";
import fs from "fs";

class cartManager {
  #error;
  constructor(filename) {
    this.filename = filename;
    this.format = "utf-8";
    this.error = "";
  }
  /**
   * Get the products
   */
  getCart = async () => {
    return JSON.parse(await fs.promises.readFile(this.filename, this.format));
  };
  /**
   * Get the products by ID
   */
  getCartById = async (id) => {
    let findCart = await this.getCart();
    findCart = findCart.find((cart) => cart.id == id);
    return findCart ? findCart : `No existe en los registros el id:${id}`;
  };
  /**
   * Get the products of a cart
   */
  getCartProduct = async (id) => {
    const getCartProducts = await this.getCart();
    const findCart = getCartProducts.find((cart) => cart.id === parseInt(id));
    return findCart && findCart.products.length >= 1 ? findCart.products : `No hay productos en el carrito`;
  };
  /**
   * Create a UNIQUE ID for each product
   */
  #createId = async () => {
    let getCartId = await this.getCart();
    return getCartId.length === 0 ? 1 : getCartId.at(-1).id + 1;
  };
  /**
   * Save the data in a file
   */
  #saveFile = async (data) => {
    return await fs.promises.writeFile(
      this.filename,
      JSON.stringify(data, null, "\t")
    );
  };
  /**
   * Update product
   */
  updateCart = async (id, product, quantity) => {
    product = parseInt(product);
    const getCarts = await this.getCart();
    const findCart = getCarts.find((cart) => cart.id === parseInt(id));
    const findItem = findCart.products.find(
      (products) => products.product === product
    );

    if (isNaN(product)) return "El product debe ser un numero";

    if (findCart && !findItem) {
      const newProduct = {
        product: product,
        quantity: quantity,
      };
      findCart.products.push(newProduct);
    } else {
      findItem.quantity++;
    }
    return await this.#saveFile(getCarts);
  };
  /**
   * Create a new product
   */
  createCart = async () => {
    const cart = await this.getCart();
    cart.push({
      id: await this.#createId(),
      products: [],
    });
    return await this.#saveFile(cart);
  };
}

export default cartManager;
