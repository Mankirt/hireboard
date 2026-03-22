import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { searchJobs } from '../services/searchService.js'

export const searchController = asyncHandler(async (req, res) => {
    const {
        query,
        location,
        jobType,
        salaryMin,
        salaryMax,
        page = 1,
        limit = 10,
    } = req.query

    const result = await searchJobs({
        query,
        location,
        jobType,
        salaryMin,
        salaryMax,
        page,
        limit,
    })

    return res.status(200).json(
        new ApiResponse(200, result, 'Search completed successfully')
    )
})