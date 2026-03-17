import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import pool from '../config/db.js'
import { ApiError } from '../utils/ApiError.js'

const SALT_ROUNDS = 10

export async function hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash)
}

export function generateAccessToken(userId, role){
    return jwt.sign({ userId, role}, process.env.JWT_ACCESS_SECRET, {expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m'})
}

export function generateRefreshToken(){
    return crypto.randomBytes(40).toString('hex')
}

export function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex')
}

export function verifyAccessToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    } catch (error) {
        throw new ApiError(401, 'Invalid or expired access token')
    }
}

export async function storeRefreshToken(userId, refreshToken){
    const tokenHash = hashToken(refreshToken)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    await pool.query(
        `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
        [userId, tokenHash, expiresAt]
    )
}

export async function verifyRefreshToken(refreshToken){
    const tokenHash = hashToken(refreshToken)
    const result = await pool.query(
        `SELECT user_id FROM refresh_tokens WHERE token_hash = $1`,
        [tokenHash]
    )
    const record = result.rows[0]
    if (!record){
        throw new ApiError(401, 'Invalid refresh token')
    }
    if (new Date(record.expires_at) < new Date()){
        await pool.query(`DELETE FROM refresh_tokens WHERE token_hash = $1`, [tokenHash])
        throw new ApiError(401, 'Refresh token expired')
    }
    return record
}

export async function deleteRefreshToken(refreshToken){
    const tokenHash = hashToken(refreshToken)
    await pool.query(`DELETE FROM refresh_tokens WHERE token_hash = $1`, [tokenHash])
}

export async function deleteAllRefreshTokens(userId){
    await pool.query(`DELETE FROM refresh_tokens WHERE user_id = $1`, [userId])
}

export async function register({email, password, fullName, role, companyName}){
    const existing = await pool.query('SELECT id from users WHERE email = $1', [email])
    if (existing.rows.length > 0){
        throw new ApiError(400, 'Email already registered')
    }

    const passwordHash = await hashPassword(password)

    const result = await pool.query(
        `INSERT INTO users (email, password_hash, full_name, role) 
         VALUES ($1, $2, $3, $4) RETURNING id`, 
         [email, passwordHash, fullName, role]
    )

    const user = result.rows[0]

    if (role === 'employer'){
        if (!companyName){
            throw new ApiError(400, 'Company name is required for employers')
        }
        await pool.query(
            `INSERT INTO employer_profiles (user_id, company_name) VALUES ($1, $2)`,
            [user.id, companyName]
        )
        //Create a free subscription record
        await pool.query(
            `INSERT INTO subscriptions (user_id, plan, status) VALUES ($1, 'free', 'active')`,
            [user.id]
        )
    }

    const accessToken = generateAccessToken(user.id, role)
    const refreshToken = generateRefreshToken()

    await storeRefreshToken(user.id, refreshToken)

    return { user, accessToken, refreshToken }

    
}

export async function login({email, password}){
    const result = await pool.query('SELECT id, email, full_name, role, password_hash FROM users WHERE email = $1', [email])
    const user = result.rows[0]

    if(!user || !(await verifyPassword(password, user.password_hash))){
        throw new ApiError(401, 'Invalid email or password')
    }

    const accessToken = generateAccessToken(user.id, user.role)
    const refreshToken = generateRefreshToken()
    await storeRefreshToken(user.id, refreshToken)
    const { password_hash, ...safeUser } = user

    return { user: safeUser, accessToken, refreshToken }
}