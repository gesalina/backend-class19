import { productModel } from "../../models/product.model.js";
/**
 * This class handle everything about our products
 */
class ProductManager {
  constructor() {
    this.error = "";
  }
  /**
   * This function get all the product from our collection
   */
  getProducts = async (request) => {
    const limit = parseInt(request.query.limit) || 10;
    const page = parseInt(request.query.page) || 1;
    const sort = request.query.sort === "desc" ? -1 : 1;
    const query = request.query.query || {};
    let options;

    request.query.sort
      ? (options = {
          page,
          limit,
          sort,
          lean: true,
          leanWithId: false,
        })
      : (options = { page, limit, lean: true, leanWithId: false });

    const filter = {};

    if (query.category) filter.category = query.category;
    if (query.availability) filter.availability = query.availibility;

    const products = await productModel.paginate(filter, options);

    return products;
  };
  /**
   * This function find a product by ID
   */
  findProductById = async (productId) => {
    const product = await productModel.find({ id: productId });
    if (!product || product <= 0) {
      return (this.error = { error: "Product not found" });
    }
    return product;
  };
  /**
   * This function generate new id in each new product inserted
   */
  generateId = async (request) => {
    let getProductsId = await this.getProducts(request);
    return getProductsId.docs.length === 0
      ? 1
      : getProductsId.docs.at(-1).id + 1;
  };

  createProduct = async (product, request) => {
    const result = await productModel.create({
      id: await this.generateId(request),
      ...product,
      status: true,
    });
    return result;
  };
  deleteProduct = async (productId) => {
    const result = await productModel.findOneAndDelete({ id: productId });
    if (!result || result <= 0) {
      return (this.error = { error: "Product not found" });
    }
    return result;
  };
  updateProduct = async (productId, data) => {
    const result = await productModel.findOneAndUpdate({ id: productId }, data);
    if (!result || result <= 0) {
      return (this.error = { error: `Cant update a inexistent ID` });
    }
    return result;
  };
}

export default ProductManager;
