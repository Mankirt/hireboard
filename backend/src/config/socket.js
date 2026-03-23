import { Server } from 'socket.io'
import { verifyAccessToken } from '../services/authService.js'

let io = null

export function initSocketIO(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true,
        },

        pingTimeout: 60000,
        pingInterval: 25000,
    })

    io.use((socket, next) => {
        
        const token = socket.handshake.auth?.token || socket.handshake.query?.token

        if (!token) {
            return next(new Error('Authentication required'))
        }

        try {
            const decoded = verifyAccessToken(token)
            socket.user = {
                userId: decoded.userId,
                role: decoded.role,
            }

            next()  

        } catch (err) {
            return next(new Error('Invalid or expired token'))
        }
    })

    io.on('connection', (socket) => {
        const { userId, role } = socket.user

        console.log(`Socket connected: user ${userId} (${role})`)

        socket.join(`user:${userId}`)

        if (role === 'employer') {
            socket.join(`employer:${userId}`)
        }

        socket.on('ping', () => {
            socket.emit('pong', { timestamp: new Date().toISOString() })
        })


        socket.on('disconnect', (reason) => {
            console.log(`Socket disconnected: user ${userId} — ${reason}`)
        })
    })

    console.log('✅ Socket.io initialized')
    return io
}


export function getIO() {
    if (!io) {
        throw new Error('Socket.io not initialized. Call initSocketIO() first.')
    }
    return io
}


export function notifyUser(userId, event, data) {
    try {
        const ioInstance = getIO()
        ioInstance.to(`user:${userId}`).emit(event, {
            ...data,
            timestamp: new Date().toISOString(),
        })
    } catch (err) {
        console.error('Socket notification failed:', err.message)
    }
}