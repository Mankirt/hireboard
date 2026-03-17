import express from 'express'
import { 
    registerController,
    loginController,
    logoutController,
    refreshController
 } from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/register', registerController)
router.post('/login', loginController)
router.post('/logout', logoutController)
router.post('/refresh', refreshController)  

export default router