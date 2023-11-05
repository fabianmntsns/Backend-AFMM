import mongoose from "mongoose";
import ProductManagerDB from "./productManagerMongoDB.js";
import CartModel from "../models/carts.model.js";


class CartManagerDB {

    async addCart() {
        try {
            return await CartModel.create({ products: [] })
        } catch (e) {
            return "[400] " + e.message
        }
    }

    async getCartById(id) {
        try {
            const objectId = new mongoose.Types.ObjectId(id)
            const cart = await CartModel.find({ _id: objectId }).lean()
            if (!cart) return '[404] No encontrado'
            return cart[0]
        } catch (e) {
            return "[400] " + e.message
        }
    }

    async addProductToCart(pid, cid) {
        try {
            const pm = new ProductManagerDB()
            const result = await pm.getProductById(pid)
            if (typeof result == 'string') {
                return result
            }

            const objectCid = new mongoose.Types.ObjectId(cid)
            const objectPid = new mongoose.Types.ObjectId(pid)
            const cart = await this.getCartById(cid)

            const product = cart.products.find(item => item._id._id.toString() == objectPid.toString())


            if (!product) {
                cart.products.push({ _id: objectPid, quantity: 1 })

            } else {
                cart.products = cart.products.map(prod => {
                    if (prod._id._id.toString() == objectPid.toString()) {
                        return { ...prod, quantity: (prod.quantity + 1) };

                    }
                    return prod
                });
            }

            await CartModel.findOneAndUpdate({ _id: objectCid }, { products: cart.products })
            return this.getCartById(cid)

        } catch (e) {
            return "[400] " + e.message
        }
    }

    async deleteProductFromCart(cid, pid) {
        try {
            const objectCid = new mongoose.Types.ObjectId(cid)
            const objectPid = new mongoose.Types.ObjectId(pid)

            const cart = await this.getCartById(cid)

            cart.products = cart.products.map(prod => {
                if (prod._id._id.toString() == objectPid.toString()) {
                    return "eliminado"
                }
                return prod
            });

            const index = cart.products.indexOf("eliminado")
            cart.products.splice(index, 1)

            await CartModel.findOneAndUpdate({ _id: objectCid }, { products: cart.products })
            return this.getCartById(cid)


        } catch (e) {
            return "[400] " + e.message
        }

    }

    async updateCart(cid, products) {
        try {
            const objectCid = new mongoose.Types.ObjectId(cid)
            const pm = new ProductManagerDB()

            for (let i = 0; i < products.length; i++) {
                const pid = products[i]._id
                const result = await pm.getProductById(pid)
                if (typeof result == 'string') {
                    
                    return result
                }
                
                const objectPid = new mongoose.Types.ObjectId(pid)
                const cart = await this.getCartById(cid)

                const product = cart.products.find(item => item._id._id.toString() == objectPid.toString())


                if (!product) {
                    cart.products.push({ _id: objectPid, quantity: products[i].quantity })

                } else {
                    cart.products = cart.products.map(prod => {
                        if (prod._id._id.toString() == objectPid.toString()) {
                            return { ...prod, quantity: products[i].quantity };

                        }
                        return prod
                    });
                }

                await CartModel.findOneAndUpdate({ _id: objectCid }, { products: cart.products }, {returnDocument: 'after'})
            }
            return this.getCartById(cid)

        } catch (e) {
            return "[400] " + e.message
        }

    }

    async updateProductQuantity(cid, pid, quantity) {
        try {
            const objectCid = new mongoose.Types.ObjectId(cid)
            const objectPid = new mongoose.Types.ObjectId(pid)

            const cart = await this.getCartById(cid)


            cart.products = cart.products.map(prod => {
                if (prod._id._id.toString() == objectPid.toString()) {
                    return { ...prod, quantity };

                }
                return prod
            });

            await CartModel.findOneAndUpdate({ _id: objectCid }, { products: cart.products })
            return this.getCartById(cid)


        } catch (e) {
            return "[400] " + e.message
        }
    }

    async deleteAllProducts(cid) {
        try {
            const objectId = new mongoose.Types.ObjectId(cid)
            return await CartModel.findOneAndUpdate({ _id: objectId }, { products: [] })
        } catch (e) {
            return "[400] " + e.message
        }
    }
}


export default CartManagerDB