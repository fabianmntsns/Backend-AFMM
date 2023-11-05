import { Router } from "express";
import { getProductByIdViewController, productsViewController, realTimeProductsViewController } from "../controllers/product.controller.js";
import { getCartByIdViewController } from "../controllers/cart.controller.js";
import { chatViewController } from "../controllers/chat.controller.js";
import { publicRoutes } from "../middlewares/auth.middleware.js";

const router = Router()

router.get("/products", publicRoutes, productsViewController)

router.get("/realTimeProducts", publicRoutes, realTimeProductsViewController)

router.get("/chat", publicRoutes, chatViewController)

router.get('/carts/:cid', publicRoutes, getCartByIdViewController)

router.get('/products/:pid', publicRoutes, getProductByIdViewController)

export default router 