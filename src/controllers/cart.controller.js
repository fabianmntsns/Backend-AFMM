import CartManagerDB from "../dao/managers/cartManagerMongoDB.js"

const cm = new CartManagerDB()

export const addCartController = async (req, res) => {
    const result = await cm.addCart()
    if (typeof result == 'string') {
        const error = result.split(' ')
        return res.status(parseInt(error[0].slice(1, 4))).json({ error: result.slice(6) })
    }
    res.status(201).json({ status: 'success', payload: result })
}


export const getCartByIdController = async (req, res) => {
    const id = req.params.cid
    const result = await cm.getCartById(id)
    if (typeof result == 'string') {
        const error = result.split(' ')
        return res.status(parseInt(error[0].slice(1, 4))).json({ error: result.slice(6) })
    }
    res.status(200).json({ status: 'success', payload: result })
}

export const addProductToCartController = async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const result = await cm.addProductToCart(pid, cid)
    if (typeof result == 'string') {
        const error = result.split(' ')
        return res.status(parseInt(error[0].slice(1, 4))).json({ error: result.slice(6) })
    }
    res.status(201).json({ status: 'success', payload: result })
}

export const deleteProductFromCartController = async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid

    const result = await cm.deleteProductFromCart(cid, pid)

    if (typeof result == 'string') {
        const error = result.split(' ')
        return res.status(parseInt(error[0].slice(1, 4))).json({ error: result.slice(6) })
    }
    res.status(201).json({ status: 'success', payload: result })
}

export const updateCartController = async (req, res) => {
    const cid = req.params.cid
    const body = req.body
    
    const result = await cm.updateCart(cid, body.products)
    if (typeof result == 'string') {
        const error = result.split(' ')
        return res.status(parseInt(error[0].slice(1, 4))).json({ error: result.slice(6) })
    }
    res.status(201).json({ status: 'success', payload: result })
}

export const updateProductQuantityController = async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const body = req.body 
   
    const result = await cm.updateProductQuantity(cid, pid, body.quantity)
    if (typeof result == 'string') {
        const error = result.split(' ')
        return res.status(parseInt(error[0].slice(1, 4))).json({ error: result.slice(6) })
    }
    res.status(201).json({ status: 'success', payload: result })
}

export const deleteAllProductsController = async (req, res) => {
    const cid = req.params.cid
   
    const result = await cm.deleteAllProducts(cid)
    if (typeof result == 'string') {
        const error = result.split(' ')
        return res.status(parseInt(error[0].slice(1, 4))).json({ error: result.slice(6) })
    }
    res.status(201).json({ status: 'success', payload: result })
}

// views

export const getCartByIdViewController = async (req, res) => {
    const cid = req.params.cid
    const result = await cm.getCartById(cid)
    if (typeof result == 'string') {
        const error = result.split(' ')
        return res.status(parseInt(error[0].slice(1, 4))).json({ error: result.slice(6) })
    }

    res.render('cart', { cart: result })

}