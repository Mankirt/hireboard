import express from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { register, login, deleteRefreshToken, rotateRefreshToken } from '../services/authService.js'

const router = express.Router()

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
}

route.post('/refresh', asyncHandler(async (req, res) => {
    const incomingToken = req.cookies?.refreshToken
    if (!incomingToken){
        throw new ApiError(401, 'No refresh token - Please log in again')
    }
    const { user, accessToken, refreshToken } = await rotateRefreshToken(incomingToken)
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
    return res.status(200).json(
        new ApiResponse(200, { user, accessToken }, 'Token refreshed successfully')
    )
}))


// Register
router.post('/register', asyncHandler(async (req, res) => {
    const { email, password, fullName, role, companyName } = req.body
    if (!email || !password || !fullName || !role){
        throw new ApiError(400, 'Missing required fields')
    }
    if (!['seeker', 'employer'].includes(role)){
        throw new ApiError(400, 'Role must be either seeker or employer')
    }

    if (password.length < 8){
        throw new ApiError(400, 'Password must be at least 8 characters long')
    }

    const { user, accessToken, refreshToken } = await register({email, password, fullName, role, companyName})
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
    return res.status(201).json(
        new ApiResponse(201, { user, accessToken }, 'Registration successful')
    )
}))

// Login
router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password){
        throw new ApiError(400, 'Email and password are required')
    }

    const { user, accessToken, refreshToken } = await login({email, password})
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
    return res.status(200).json(
        new ApiResponse(200, { user, accessToken }, 'Login successful')
    )
}))

//Logout
router.post('/logout', asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken
    if (refreshToken){
        await deleteRefreshToken(refreshToken)
    }
    res.clearCookie('refreshToken', COOKIE_OPTIONS)
    return res.status(200).json(
        new ApiResponse(200, null, 'Logout successful')
    )
}))

export default router


