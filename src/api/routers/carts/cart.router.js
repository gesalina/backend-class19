import { Router } from "express";
import cartManager from "../../controllers/dao/CartManager.js";

const router = Router();
const cart = new cartManager();

/**
 * This endpoint get all carts
 */
router.get("/", async (request, response) => {
  try {
    const getCarts = await cart.getCarts();
    return response.json({ carts: getCarts });
  } catch (error) {
    return response.status(404).json({ status: "error", error: error });
  }
});
/**
 * This endpoint get the products of a cart
 */
router.get("/:cid/products", async (request, response) => {
  const cartId = request.params.cid;
  try {
    const getProductsCarts = await cart.getCartProduct(cartId);
    if (getProductsCarts.error) {
      return response
        .status(404)
        .json({ status: "error", error: getProductsCarts.error });
    }
    response.json({ payload: getProductsCarts });
  } catch (error) {
    return response.status(404).json({ status: "error", error: error });
  }
});
/**
 * This endpoint find a cart by ID
 */
router.get("/:cid", async (request, response) => {
  const cartId = request.params.cid;
  try {
    const getCart = await cart.findCartById(cartId);
    if (getCart.error) {
      return response
        .status(404)
        .json({ status: "error", error: getCart.error });
    }
    response.json({ cart: getCart });
  } catch (error) {
    return response.status(404).json({ status: "error", error: error });
  }
});
/**
 * This endpoint create a new cart
 */
router.post("/", async (request, response) => {
  try {
    await cart.createCart();
    response.json({ message: "Carrito creado satisfactoriamente" });
  } catch (error) {
    return response.status(404).json({ status: "error", error: error });
  }
});
/**
 * This endpoint add or update the product the a specific cart | OLDTEST ROUTE
 */
// router.post("/:cid/products/:pid", async (request, response) => {
//   let cartId = request.params.cid;
//   let productId = request.params.pid;
//   const { quantity } = request.body;
//   try {
//     const cartUpdate = await cart.updateCart(cartId, productId, quantity);
//     if (cartUpdate.error) {
//       return response
//         .status(404)
//         .json({ status: "error", error: cartUpdate.error });
//     }
//     response.json({ status: "Success" });
//   } catch (error) {
//     return response.status(404).json({ status: "error", error: error });
//   }
// });
/**
 *  This endpoint delete a product from a cart | EXPERIMENTAL
 * 
 */
router.delete("/:cid/products/:pid", async (request, response) => {
  const cartId = request.params.cid;
  const productId = request.params.pid;
  try {
    const deleteCartProduct = await cart.deleteProduct(cartId, productId);
    if (deleteCartProduct.error) {
      return response
        .status(404)
        .json({ status: "error", error: deleteCartProduct.error });
    }
    response.json({ status: "success", payload: deleteCartProduct });
  } catch (err) {
    response.status(404).json({ status: "error", error: err.message });
  }
});
/**
 * This ENDPOINT update the cart with a array of products
 */
router.put("/:cid", async (request, response) => {
  const cartId = request.params.cid;
  const { product, quantity } = request.body;
  try {
    const updateCart = await cart.addProductCart(cartId, product, quantity);
    if (updateCart.error) {
      return response
        .status(404)
        .json({ status: "error", error: updateCart.error });
    }
    response.status(200).json({ status: "success", payload: updateCart });
  } catch (error) {
    response.status(404).json({ status: "error", error: error });
  }
});
/**
 *  This endpoint update the quantity of a product in a specific cart
 */
router.put("/:cid/products/:pid", async (request, response) => {
  const cartId = request.params.cid;
  const productId = request.params.pid;
  const { quantity } = request.body;
  try {
    const updateProduct = await cart.updateProductQuantity(
      cartId,
      productId,
      quantity
    );
    if (updateProduct.error) {
      return response
        .status(404)
        .json({ status: "error", error: updateProduct.error });
    }
    response.status(200).json({ status: "success", payload: updateProduct });
  } catch (error) {
    response.status(404).json({ status: "error", error: error });
  }
});

/**
 * This ENDPOINT delete all products from a specific cart
 */
router.delete("/:cid", async (request, response) => {
  const cartId = request.params.cid;
  try {
    const deleteProducts = await cart.deleteAllProducts(cartId);
    if (deleteProducts.error || deleteProducts.modifiedCount == 0) {
      return response
        .status(404)
        .json({ status: "error", error: deleteProducts.error });
    }
    response.status(200).json({ status: "success", payload: deleteProducts });
  } catch (error) {
    response.status(404).json({ status: "error", error: error });
  }
});
export default router;
