import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'hireboard',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})

pool.on('error', (err) => {
    console.error('Unexpected DB pool error:', err)
})

export async function initDB() {
    const client = await pool.connect()

    try{
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                full_name VARCHAR(255) NOT NULL,
                role VARCHAR(20) NOT NULL CHECK (role IN ('seeker', 'employer')),
                avatar_url TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );`)

        await client.query(`
            CREATE TABLE IF NOT EXISTS refresh_tokens (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                token_hash VARCHAR(255) UNIQUE NOT NULL,
                expires_at TIMESTAMPTZ NOT NULL,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );`)
        
        await client.query(`
            CREATE TABLE IF NOT EXISTS employer_profiles (
                id SERIAL PRIMARY KEY,
                user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                company_name VARCHAR(255) NOT NULL,
                website TEXT,
                description TEXT,
                logo_url TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );`)
        
        await client.query(`
            CREATE TABLE IF NOT EXISTS jobs (
                id  SERIAL PRIMARY KEY,
                employer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
                title  VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                location VARCHAR(255),
                job_type VARCHAR(50) CHECK (job_type IN ('full-time', 'part-time', 'contract', 'remote')),
                salary_min INTEGER,
                salary_max INTEGER,
                status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            )`)

        console.log("Database tables ready")
    } catch (err){
        console.error("Error initializing database:", err)
        throw err
    } finally {
        client.release()
    }
}


export default pool