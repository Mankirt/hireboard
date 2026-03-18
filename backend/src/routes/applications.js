import express from 'express'
import { verifyJWT, requireRole, optionalAuth } from '../middleware/index.js'
import {
  applyController,
  getMyApplicationsController,
  getJobApplicationsController,
  updateStatusController,
  hasAppliedController,
} from '../controllers/application.controller.js'

const router = express.Router()

//SEEKER ROUTES 

// Apply to a job
router.post('/:jobId', verifyJWT, requireRole('seeker'), applyController)
// View own applications
router.get('/mine', verifyJWT, requireRole('seeker'), getMyApplicationsController )
// Check if already applied (works for guests too)
router.get('/check/:jobId', optionalAuth, hasAppliedController)

//EMPLOYER ROUTES

// View all applicants for a job
router.get( '/job/:jobId', verifyJWT, requireRole('employer'), getJobApplicationsController )
// Update application status
router.put( '/:id/status', verifyJWT, requireRole('employer'), updateStatusController )

export default router