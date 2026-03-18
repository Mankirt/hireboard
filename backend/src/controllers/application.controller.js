import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import {
  applyToJob,
  getSeekerApplications,
  getJobApplications,
  updateApplicationStatus,
  hasApplied,
} from '../services/applicationService.js'

export const applyController = asyncHandler(async (req, res) => {
    const jobId = parseInt(req.params.jobId)
    const { coverLetter } = req.body

    if (isNaN(jobId)) {
        throw new ApiError(400, 'Invalid job ID')
    }

    const application = await applyToJob({
        seekerId: req.user.userId,
        jobId,
        coverLetter,
    })

    return res.status(201).json(
        new ApiResponse(201, application, 'Application submitted successfully')
    )
})

export const getMyApplicationsController = asyncHandler(async (req, res) => {
    const applications = await getSeekerApplications(req.user.userId)

    return res.status(200).json(
        new ApiResponse(200, applications, 'Applications fetched successfully')
    )
})

export const getJobApplicationsController = asyncHandler(async (req, res) => {
    const jobId = parseInt(req.params.jobId)

    if (isNaN(jobId)) {
        throw new ApiError(400, 'Invalid job ID')
    }

    const applications = await getJobApplications(jobId, req.user.userId)

    return res.status(200).json(
        new ApiResponse(200, applications, 'Applications fetched successfully')
    )
})

export const updateStatusController = asyncHandler(async (req, res) => {
    const applicationId = parseInt(req.params.id)
    const { status } = req.body

    if (isNaN(applicationId)) {
        throw new ApiError(400, 'Invalid application ID')
    }

    if (!status) {
        throw new ApiError(400, 'Status is required')
    }

    const application = await updateApplicationStatus({
        applicationId,
        employerId: req.user.userId,
        newStatus: status,
    })

    return res.status(200).json(
        new ApiResponse(200, application, 'Application status updated')
    )
})

export const hasAppliedController = asyncHandler(async (req, res) => {
    const jobId = parseInt(req.params.jobId)

    const applied = await hasApplied(req.user?.userId, jobId)

    return res.status(200).json(
        new ApiResponse(200, { applied }, 'Check complete')
    )
})