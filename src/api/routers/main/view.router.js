import { Router, response } from "express";
import ProductManager from "../../controllers/dao/ProductManager.js";

const router = Router();
const product = new ProductManager();

/*
 * This router allows to show the products in the main view
 */

// router.get("/", async (request, response) => {
//   const getProducts = await product.getProducts(request);
//   response.render("home", {
//     plugins: "?plugins=aspect-ratio",
//     view_name: "Products View",
//     products: getProducts.docs,
//     prevLink: getProducts.hasPrevPage
//       ? `http://localhost:8080?page=${getProducts.prevPage}&limit=${getProducts.limit}`
//       : null,
//     nextLink: getProducts.hasNextPage
//       ? `http://localhost:8080?page=${getProducts.nextPage}&limit=${getProducts.limit}`
//       : null,
//   });
// });

/**
*  This router allows show the products | EXPERIMENTAL
*
router.get('/products', async(request, response) => {
  const getProducts = await product.getProducts();
  response.render('home', {
    plugins = '?plugins=aspect-radio',
    view_name: 'Tenda - Products',
    products: getProducts
  })
})
*/

/**
 * This router allows to render the products on realtime
 * have a form and a delete button working with websocket
 */
router.get("/realtimeproducts", async (request, response) => {
  const products = await product.getProducts(request);
  response.render("realTimeProducts", {
    view_name: "Productos en tiempo real",
    products: products.docs,
  });
});

/**
 *  This router render the chat, that work with websocket
 */
router.get("/chat", async (request, response) => {
  response.render("chat");
});

/**
 * Auth user and password
 */
const auth = (request, response, next) => {
  if (
    request.session?.user &&
    request.body.password === request.session.user.password
  ) {
    console.log("password validate");
    return next();
  }
  return response.status(401)
};
/**
 * This route get the login and register form
 */
router.get("/", (request, response) => {
  response.render("login", {
    view_name: "Login | Tenda",
  });
});

router.get("/products", async (request, response) => {
  const products = await product.getProducts(request);
  if (request.session?.user) {
    return response.render("products", {
      plugins: "?plugins=aspect-ratio",
      view_name: "Products View",
      username: request.session.user.username,
      role: request.session.user.role,
      products: products.docs,
      prevLink: products.hasPrevPage
        ? `http://localhost:8080?page=${products.prevPage}&limit=${products.limit}`
        : null,
      nextLink: products.hasNextPage
        ? `http://localhost:8080?page=${products.nextPage}&limit=${products.limit}`
        : null,
    });
  }
  response.redirect("/");
});
/**
 * Products view after login
 */
router.post("/login", auth, async (request, response) => {
  response.redirect("/products");
});

/**
 * This ENDPOINT add a new user and create a session
 */
router.post("/register", (request, response) => {
  const { username, password } = request.body;
  let user = {
    username: username,
    password: password,
    ui_preference: "dark",
    lenguage: "es",
    location: "ar",
    role: "user",
  };
  if (username === "admin@coderhouse.com" && password === "adminCod3r123") {
    user.role = "admin";
  }
  request.session.user = user;
  response.json({ status: "success", message: "user created" });
});

/**
 * This ENDPOINT destroy the session
 */
router.post("/logout", (request, response) => {
  request.session.destroy((err) => {
    if (err)
      return response.json({ status: "error", message: "Ocurrio un error" });
    return response.redirect("/");
  });
});

export default router;
