'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { api, setAccessToken, clearAccessToken, getAccessToken } from '@/lib/api'



const AuthContext = createContext(null)

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within Providers')
    return context
}



const SocketContext = createContext(null)

export function useSocket() {
    return useContext(SocketContext)
}


export default function Providers({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [socket, setSocket] = useState(null)

  
    useEffect(() => {
            restoreSession()
    }, [])

  
    useEffect(() => {
        if (user && getAccessToken()) {
            connectSocket()
        } else {
            disconnectSocket()
        }
    }, [user])

    async function restoreSession() {
        try {
            const { data } = await api.refresh()
            setAccessToken(data.data.accessToken)
            setUser(data.data.user)
        } catch {
            clearAccessToken()
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    function connectSocket() {
        const token = getAccessToken()
        if (!token) return

        const newSocket = io(
            process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
            {
                auth: { token },
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            }
        )

        newSocket.on('connect', () => {
            console.log('Socket connected')
        })

        newSocket.on('connect_error', (err) => {
            console.error('Socket connection error:', err.message)
        })

        setSocket(newSocket)
    }

    function disconnectSocket() {
        if (socket) {
            socket.disconnect()
            setSocket(null)
        }
    }

   
    async function login(email, password) {
        const { data } = await api.login({ email, password })
        setAccessToken(data.data.accessToken)
        setUser(data.data.user)
        return data.data
    }

    async function register(userData) {
        const { data } = await api.register(userData)
        setAccessToken(data.data.accessToken)
        setUser(data.data.user)
        return data.data
    }

    async function logout() {
        try {
            await api.logout()
        } catch {
            // Even if logout API fails, clear local state
        } finally {
            clearAccessToken()
            setUser(null)
            disconnectSocket()
        }
    }

  
    if (loading) {
        return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-slate-700 border-t-violet-500
                            rounded-full animate-spin" />
        </div>
        )
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, setUser }}>
            <SocketContext.Provider value={socket}>
                {children}
            </SocketContext.Provider>
        </AuthContext.Provider>
    )
}