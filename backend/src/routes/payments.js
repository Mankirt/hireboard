import express from 'express'
import { verifyJWT, requireRole } from '../middleware/index.js'
import {
  createCheckoutController,
  getSubscriptionController,
  cancelSubscriptionController,
  webhookController
} from '../controllers/payment.controller.js'

const router = express.Router()

router.post('/webhook', webhookController)

router.post(
    '/create-checkout-session',
    verifyJWT,
    requireRole('employer'),
    createCheckoutController
)


router.get(
    '/subscription',
    verifyJWT,
    requireRole('employer'),
    getSubscriptionController
)

router.post(
    '/cancel',
    verifyJWT,
    requireRole('employer'),
    cancelSubscriptionController
)

export default router