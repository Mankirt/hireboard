import express from 'express'
import { 
    registerController,
    loginController,
    logoutController,
    refreshController,
    getMeController
 } from '../controllers/auth.controller.js'
import { verifyJWT } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/register', registerController)
router.post('/login', loginController)
router.post('/logout', logoutController)
router.post('/refresh', refreshController) 

router.get('/me', verifyJWT, getMeController)

export default router