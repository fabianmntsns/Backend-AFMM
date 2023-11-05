import { Router } from "express";
import { privateRoutes, publicRoutes } from "../middlewares/auth.middleware.js";
import { loginViewController, profileViewController, registerViewController } from "../controllers/session.controller.js";

const router = Router()

router.get('/register', privateRoutes, registerViewController)

router.get('/', privateRoutes, loginViewController)

router.get('/profile', publicRoutes, profileViewController)

router.get('/session/register', privateRoutes, registerViewController)

router.get('/session/login', privateRoutes, loginViewController)

router.get('/session/profile', publicRoutes, profileViewController)


export default router