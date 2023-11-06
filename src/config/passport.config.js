import passport from "passport";
import GithubStrategy from "passport-github2";
import local from "passport-local";
import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import CartModel from "../dao/models/carts.model.js";
import config from "./config.js";

const localStrategy = local.Strategy

const initializePassport = () => {

    passport.use('register', new localStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body
        try {
            const user = await UserModel.findOne({ email: username })
            if (user) {
                return done(null, false)
            }
            const cartForNewUser = await CartModel.create({})
            const newUser = {
                first_name, last_name, email, age, password: createHash(password), cart: cartForNewUser._id, role: 'user',
            };

            const result = await UserModel.create(newUser)
            return done(null, result)

        } catch (err) {
            return done(err)
        }

    }))

    passport.use('login', new localStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            if (username === config.admin.email && password === config.admin.password) {
                console.log("admin")
                const user = {
                    _id: "adm1n",
                    first_name: " ",
                    last_name: " ",
                    email: username,
                    age: " ",
                    cart: " ",
                    role: "admin",
                }
                console.log(user)
                return done(null, user)

            }

            const user = await UserModel.findOne({ email: username })
            if (!user) {
                return done(null, false)
            }
            if (!isValidPassword(user, password)) return done(null, false)
            return done(null, user)
        } catch (err) {

        }
    }))

    passport.use('github', new GithubStrategy({
        clientID: config.github.client_id,
        clientSecret: config.github.client_secret,
        callbackURL: config.github.callback_url,
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        try {
            const user = await UserModel.findOne({ email: profile._json.email })
            if (user) return done(null, user)
            const newUser = await UserModel.create({
                first_name: profile._json.name,
                last_name: '',
                email: profile._json.email,
                password: ''
            })
            return done(null, newUser)
        } catch (error) {
            return done('Error al loguearte con GitHub')
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })
}

export default initializePassport