import express from 'express'
import { verifyJWT, requireRole, optionalAuth } from '../middleware/index.js'
import {
    applyController,
    getMyApplicationsController,
    getJobApplicationsController,
    updateStatusController,
    hasAppliedController,
    getApplicationController
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

//LOGGED IN USERS ROUTES
router.get('/:id', verifyJWT, getApplicationController)

//Documents the WebSocket events
router.get('/events', (req, res) => {
    return res.status(200).json(
      new ApiResponse(200, {
        events: [
          {
            name: 'application:status_updated',
            description: 'Fired when employer updates application status',
            payload: {
              applicationId: 'number',
              jobTitle: 'string',
              companyName: 'string',
              newStatus: 'pending | reviewing | accepted | rejected',
              previousStatus: 'pending | reviewing | accepted | rejected',
              timestamp: 'ISO date string',
            }
          }
        ]
      }, 'WebSocket events documentation')
    )
})

export default router