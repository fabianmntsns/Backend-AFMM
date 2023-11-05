import express from "express";
import viewsRouter from "./router/view.router.js"
import handlebars from 'express-handlebars'
import mongoose from "mongoose";
import productsRouter from "./router/product.router.js";
import cartsRouter from "./router/cart.router.js";
import messagesRouter from "./router/message.router.js";
import sessionViewRouter from "./router/session.view.router.js";
import sessionRouter from "./router/session.router.js";
import sessionRouter2 from "./router/session.router.js"; //ojo 
import { Server } from "socket.io";
import MessageManagerDB from "./dao/managers/messageManagerMongoDB.js"
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js";



const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"))
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')


app.use(session({
     store: MongoStore.create({
          mongoUrl: 'mongodb+srv://fabianmntsns:prueba@cluster0.b8afudm.mongodb.net',
          dbName: 'sessions'
     }),
     secret: 'victoriasecret',
     resave: true,
     saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use('/session', sessionRouter2)
app.use('/', sessionViewRouter)
app.use('/api/sessions', sessionRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/messages', messagesRouter)
app.use('/', viewsRouter)


const mm = new MessageManagerDB()

export const PORT = 8080

try {
     await mongoose.connect('mongodb+srv://fabianmntsns:prueba@cluster0.b8afudm.mongodb.net/ecommerce')
     console.log('DB connected')


     const httpServer = app.listen(PORT, () => { console.log('Server Up!') })
     const socketServer = new Server(httpServer)


     socketServer.on("connection", async (socket) => {
          console.log("client connected ID:", socket.id)

          socket.on('productList', productListSocket => {
               socket.emit("updatedProducts", productListSocket)
          })

          socket.on('messageList', messagesListSocket => {
               socket.emit("updatedMessages", messagesListSocket)
          })
     })


} catch (err) {
     console.log(err.message)
}
