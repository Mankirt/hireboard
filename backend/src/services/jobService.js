import pool from '../config/db.js'
import { ApiError } from '../utils/ApiError.js'

function generateSlug(title){
    const base = title.toLower()
                      .trim()
                      .replace(/[^a-z0-9\s-]/g, '')  
                      .replace(/\s+/g, '-')         
                      .replace(/-+/g, '-') 
    const suffix = Math.random().toString(36).slice(2,6)
    return `${base}-${suffix}`
}

export async function createJob({
    employerId,
    title,
    description,
    location,
    jobType,
    salaryMin,
    salaryMax,
}){
    const subResult = await pool.query(
        `SELECT plan FROM subscriptions WHERE user_id = $1`,
        [employerId]
    )

    const subscription = subResult.rows[0]
    const plan = subscription?.plan || 'free'
    if (plan === 'free') {
    const countResult = await pool.query(
        `SELECT COUNT(*) FROM jobs
        WHERE employer_id = $1 AND status = 'active'`,
        [employerId]
    )
    const activeCount = parseInt(countResult.rows[0].count)

    if (activeCount >= 3) {
        throw new ApiError(
            403,
            'Free plan allows maximum 3 active jobs. Upgrade to post more.'
        )
        }
    }

    const slug = generateSlug(title)
    const result = await pool.query(
        `INSERT INTO jobs
        (employer_id, title, slug, description, location, job_type, salary_min, salary_max)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [employerId, title, slug, description, location, jobType, salaryMin, salaryMax]
    )
    return result.rows[0]
}