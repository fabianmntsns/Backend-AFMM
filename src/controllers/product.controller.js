import ProductManagerDB from "../dao/managers/productManagerMongoDB.js";
import { PORT } from "../app.js";

const pm = new ProductManagerDB()


export const getProducts = async(req, res) =>{
    const limit = req.query.limit
    const page = req.query.page
    const sort = req.query.sort
    const availability = req.query.availability
    const category = req.query.category
    const result = await pm.getProducts(limit, page, sort, availability, category)
    
    let prevLink
    if (!req.query.page) {
        prevLink = `http://${req.hostname}:${PORT}${req.originalUrl}&page=${result.prevPage}`
    } else {
        const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${result.prevPage}`)
        prevLink = `http://${req.hostname}:${PORT}${modifiedUrl}`
    }
    let nextLink
    if (!req.query.page) {
        nextLink = `http://${req.hostname}:${PORT}${req.originalUrl}&page=${result.nextPage}`
    } else {
        const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${result.nextPage}`)
        nextLink = `http://${req.hostname}:${PORT}${modifiedUrl}`
    }
    if (typeof result === ' string') return result
    return {
            status: 'success', 
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? prevLink : null,
            nextLink: result.hasNextPage ? nextLink : null
        }
}

export const getProductsController = async (req, res) => {
    const result = await getProducts(req, res)

    if (typeof result == 'string') {
        const error = result.split(' ')
        return res.status(parseInt(error[0].slice(1, 4))).json({ error: result.slice(6) })
    }
    res.status(200).json(result)
}

export const getProductByIdController = async (req, res) => {
    const id = req.params.pid
    const result = await pm.getProductById(id)
    if(typeof result == 'string'){
        const error = result.split(' ')
        return res.status(parseInt(error[0].slice(1,4))).json({ error: result.slice(6)})
    }

    res.status(200).json({ status:'success', payload: result})
}

export const addProductController = async (req, res ) => {
    const product = req.body
    const result = await pm.addProduct(product)
    if(typeof result == 'string'){
        const error = result.split(' ')
        return res.status(parseInt(error[0].slice(1,4))).json({ error: result.slice(6)})
    }
    res.status(201).json({ status: 'success', payload: result})
}

export const updateProductController = async(req, res) => {
    const id =  req.params.pid
    const updateProduct = req.body
    const result = await pm.updateProduct(id, updateProduct)
    if(typeof result == 'string'){
        const error = result.split(' ')
        return res.status(parseInt(error[0].slice(1,4))).json({ error: result.slice(6)})
    }
    res.status(200).json({status: 'success', payload: result})
}

export const deleteProductController = async(req, res) => {
    const id = req.params.pid
    const result = await pm.deleteProduct(id)
    if(typeof result == 'string'){
        const error = result.split(' ')
        return res.status(parseInt(error[0].slice(1,4))).json({ error: result.slice(6)})
    }
    res.status(200).json({status: 'success', payload: result})
}

// views

export const productsViewController = async (req, res) => {
    const pageResult = await getProducts(req, res)
    if (typeof pageResult == 'object') {
        const totalPages = []
        let link
        for (let index = 1; index <= pageResult.totalPages; index++) {
            if (!req.query.page) {
                link = `http://${req.hostname}:${PORT}${req.originalUrl}?page=${index}`
            } else {
                const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${index}`)
                link = `http://${req.hostname}:${PORT}${modifiedUrl}`
            }
            totalPages.push({ page: index, link })
        }
        
        const user = req.session.user
        res.render("home", {
            user, products: pageResult.payload,
            paginateInfo: {
                hasPrevPage: pageResult.hasPrevPage,
                hasNextPage: pageResult.hasNextPage,
                prevLink: pageResult.prevLink,
                nextLink: pageResult.nextLink,
                totalPages
            }
        })
    } else {
        const error = pageResult.split(' ')
        return res.status(parseInt(error[0].slice(1, 4))).json({ error: pageResult.slice(6) })
    }
}


export const realTimeProductsViewController = async (req, res) => {
    const result = await getProducts(req, res)
    const productsList = result.payload 

    res.render("realTimeProducts", { productsList })
}


export const getProductByIdViewController = async (req, res) => {
    const pid = req.params.pid
    const result = await pm.getProductById(pid)
    if (typeof result == 'string') {
        const error = result.split(' ')
        return res.status(parseInt(error[0].slice(1, 4))).json({ error: result.slice(6) })
    }

    res.render('product', { prod: result })

}