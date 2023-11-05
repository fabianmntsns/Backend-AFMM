import { Router } from "express"
import { addCartController, 
    addProductToCartController, 
    deleteAllProductsController, 
    deleteProductFromCartController, 
    getCartByIdController, 
    updateCartController, 
    updateProductQuantityController } from "../controllers/cart.controller.js"

const router = Router()

router.post('/', addCartController)

router.get('/:cid', getCartByIdController)

router.post('/:cid/product/:pid', addProductToCartController)

router.delete('/:cid/products/:pid', deleteProductFromCartController)

router.put('/:cid', updateCartController)

router.put('/:cid/products/:pid', updateProductQuantityController)

router.delete('/:cid', deleteAllProductsController)

export default router