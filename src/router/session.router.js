import { Router } from "express";
import passport from "passport";
import { failLoginController, failRegisterController, githubController, githubcallbackController, loginController, logoutController, registerController } from "../controllers/session.controller.js";

const router = Router()

// registro
router.post('/register', passport.authenticate('register',{failureRedirect: '/session/failRegister'}), registerController)

router.get('/failRegister', failRegisterController)

//login
router.post('/login',  passport.authenticate('login',{failureRedirect: '/session/failLogin'}), 
loginController)

router.get('/failLogin', failLoginController)


//logout
router.get('/logout', logoutController)

router.get('/github', passport.authenticate('github', {scope: ['user:email']}), githubController)

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), githubcallbackController)


export default router
