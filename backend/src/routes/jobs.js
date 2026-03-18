import express from 'express'
import { verifyJWT, requireRole, optionalAuth } from '../middleware/index.js'
import {
  createJobController,
  getAllJobsController,
  getJobController,
  getMyJobsController,
  updateJobController,
  deleteJobController,
} from '../controllers/job.controller.js'

const router = express.Router()

//PUBLIC ROUTES 
router.get('/', optionalAuth, getAllJobsController)
router.get('/:id', optionalAuth, getJobController)

//EMPLOYER ONLY
router.get('/mine', verifyJWT, requireRole('employer'), getMyJobsController)
router.post('/', verifyJWT, requireRole('employer'), createJobController)
router.put('/:id', verifyJWT, requireRole('employer'), updateJobController)
router.delete('/:id', verifyJWT, requireRole('employer'), deleteJobController)

export default router