import { verifyAccessToken } from '../services/authService.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')){
        throw new ApiError(401, 'Access token required')
    }

    const token = authHeader.split(' ')[1]
    if (!token){
        throw new ApiError(401, 'Access token required')
    }

    const decoded = verifyAccessToken(token)

    req.user = { userId: decoded.userId, role: decoded.role }
    next()
})