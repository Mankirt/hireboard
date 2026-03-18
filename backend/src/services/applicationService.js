import pool from '../config/db.js'
import { ApiError } from '../utils/ApiError.js'


export async function applyToJob({ seekerId, jobId, coverLetter }) {
    
    const jobResult = await pool.query(
        `SELECT id, status, employer_id FROM jobs WHERE id = $1`,
        [jobId]
    )

    const job = jobResult.rows[0]

    if (!job) {
        throw new ApiError(404, 'Job not found')
    }

    if (job.status !== 'active') {
        throw new ApiError(400, 'This job is no longer accepting applications')
    }

    // Prevent seekers applying to their own company's jobs
    if (seekerId === job.employer_id) {
        throw new ApiError(400, 'You cannot apply to your own job listing')
    }

    try {
        const result = await pool.query(
        `INSERT INTO applications (job_id, seeker_id, cover_letter)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [jobId, seekerId, coverLetter || null]
        )

        return result.rows[0]

    } catch (err) {
        // If seeker already applied to job, PostgreSQL throws unique violation error code '23505'
        if (err.code === '23505') {
        throw new ApiError(409, 'You have already applied to this job')
        }
        throw err
    }
}