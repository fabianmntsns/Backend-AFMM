import { Router } from "express"
//import ProductManager from "../productManager.js"
import { addProductController,
     deleteProductController, 
     getProductByIdController, 
     getProductsController, 
     updateProductController } from "../controllers/product.controller.js"

const router = Router()

//const productManager = new ProductManager('./data/products.json')

router.get('/', getProductsController)

router.get('/:pid', getProductByIdController)

router.post('/', addProductController) 

router.put('/:pid', updateProductController)

router.delete('/:pid', deleteProductController)

export default router
