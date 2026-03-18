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

export async function getAllJobs({
    page = 1,
    limit = 10,
    location,
    jobType,
    status = 'active',
} = {}) {
    const conditions = ['j.status = $1']
    const params = [status]
    let paramCount = 1
    if (location) {
        paramCount++
        conditions.push(`j.location ILIKE $${paramCount}`)
        params.push(`%${location}%`)
    }
    if (jobType) {
        paramCount++
        conditions.push(`j.job_type = $${paramCount}`)
        params.push(jobType)
    }
    const whereClause = conditions.join(' AND ')
    const offset = (page - 1) * limit

    const jobsResult = await pool.query(
        `SELECT
        j.id, j.title, j.slug, j.location, j.job_type,
        j.salary_min, j.salary_max, j.status, j.created_at,
        ep.company_name, ep.logo_url
        FROM jobs j
        JOIN employer_profiles ep ON ep.user_id = j.employer_id
        WHERE ${whereClause}
        ORDER BY j.created_at DESC
        LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
        [...params, limit, offset]
    )

    const countResult = await pool.query(
        `SELECT COUNT(*)
        FROM jobs j
        WHERE ${whereClause}`,
        params
    )

    const total = parseInt(countResult.rows[0].count)
    return {
        jobs: jobsResult.rows,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
    }
}

export async function getJobById(id) {
    const result = await pool.query(
        `SELECT
        j.*,
        ep.company_name, ep.logo_url, ep.website, ep.description AS company_description
        FROM jobs j
        JOIN employer_profiles ep ON ep.user_id = j.employer_id
        WHERE j.id = $1`,
        [id]
    )

     return result.rows[0] || null
}

export async function getJobBySlug(slug) {
    const result = await pool.query(
        `SELECT
        j.*,
        ep.company_name, ep.logo_url, ep.website, ep.description AS company_description
        FROM jobs j
        JOIN employer_profiles ep ON ep.user_id = j.employer_id
        WHERE j.slug = $1`,
        [slug]
    )

    return result.rows[0] || null
}

export async function getEmployerJobs(employerId) {
    const result = await pool.query(
        `SELECT
        j.id, j.title, j.slug, j.location, j.job_type,
        j.salary_min, j.salary_max, j.status, j.created_at,
        COUNT(a.id) AS application_count
        FROM jobs j
        LEFT JOIN applications a ON a.job_id = j.id
        WHERE j.employer_id = $1
        GROUP BY j.id
        ORDER BY j.created_at DESC`,
        [employerId]
    )

    return result.rows
}