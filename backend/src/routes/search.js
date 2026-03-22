import express from 'express'
import { optionalAuth } from '../middleware/index.js'
import { searchController } from '../controllers/search.controller.js'

const router = express.Router()

router.get('/', optionalAuth, searchController)

export default router