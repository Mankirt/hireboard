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

export async function getSeekerApplications(seekerId) {
    const result = await pool.query(
        `SELECT
        a.id,
        a.status,
        a.cover_letter,
        a.created_at,
        a.updated_at,
        j.id          AS job_id,
        j.title       AS job_title,
        j.slug        AS job_slug,
        j.location    AS job_location,
        j.job_type,
        ep.company_name,
        ep.logo_url
        FROM applications a
        JOIN jobs j             ON j.id = a.job_id
        JOIN employer_profiles ep ON ep.user_id = j.employer_id
        WHERE a.seeker_id = $1
        ORDER BY a.created_at DESC`,
        [seekerId]
    )

    return result.rows
}

export async function getJobApplications(jobId, employerId) {

    const jobResult = await pool.query(
        'SELECT id, employer_id FROM jobs WHERE id = $1',
        [jobId]
    )

    const job = jobResult.rows[0]

    if (!job) {
        throw new ApiError(404, 'Job not found')
    }

    if (job.employer_id !== employerId) {
        throw new ApiError(403, 'You can only view applications for your own jobs')
    }

    const result = await pool.query(
        `SELECT
        a.id,
        a.status,
        a.cover_letter,
        a.created_at,
        a.updated_at,
        u.id          AS seeker_id,
        u.full_name   AS seeker_name,
        u.email       AS seeker_email,
        u.avatar_url  AS seeker_avatar
        FROM applications a
        JOIN users u ON u.id = a.seeker_id
        WHERE a.job_id = $1
        ORDER BY a.created_at DESC`,
        [jobId]
    )

    return result.rows
}