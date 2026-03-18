import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import {
  createJob,
  getAllJobs,
  getJobById,
  getJobBySlug,
  getEmployerJobs,
  updateJob,
  deleteJob,
} from '../services/jobService.js'

export const createJobController = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        location,
        jobType,
        salaryMin,
        salaryMax,
    } = req.body

    if (!title || !description) {
        throw new ApiError(400, 'Title and description are required')
    }

    const job = await createJob({
        employerId: req.user.userId,
        title,
        description,
        location,
        jobType,
        salaryMin,
        salaryMax,
    })

    return res.status(201).json(
        new ApiResponse(201, job, 'Job created successfully')
    )
})

export const getAllJobsController = asyncHandler(async (req, res) => {
    
    const { page = 1, limit = 10, location, jobType } = req.query

    const result = await getAllJobs({ page, limit, location, jobType })

    return res.status(200).json(
        new ApiResponse(200, result, 'Jobs fetched successfully')
    )
})

export const getJobController = asyncHandler(async (req, res) => {
    const { id } = req.params

    // Support both numeric id and slug
    // /jobs/42      → lookup by id
    // /jobs/senior-react-engineer-a3f9 → lookup by slug
    const isNumeric = /^\d+$/.test(id)

    const job = isNumeric
        ? await getJobById(parseInt(id))
        : await getJobBySlug(id)

    if (!job) {
        throw new ApiError(404, 'Job not found')
    }

    return res.status(200).json(
        new ApiResponse(200, job, 'Job fetched successfully')
    )
})

export const getMyJobsController = asyncHandler(async (req, res) => {
    const jobs = await getEmployerJobs(req.user.userId)

    return res.status(200).json(
        new ApiResponse(200, jobs, 'Your jobs fetched successfully')
    )
})