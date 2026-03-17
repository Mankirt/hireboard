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