import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { ApiResponse } from './utils/ApiResponse.js'
import { ApiError } from './utils/ApiError.js'
import { initDB } from './config/db.js'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.js'
import jobRoutes from './routes/jobs.js'
import applicationRoutes from './routes/applications.js'
import { initElasticsearch } from './config/elasticsearch.js'
import { connectProducer, startIndexerConsumer } from './config/kafka.js'
import esClient from './config/elasticsearch.js'
import searchRoutes from './routes/search.js'
import paymentRoutes from './routes/payments.js'

dotenv.config()

const app = express()
const PORT  = process.env.PORT || 3001

// Start-up checks
const required = ['DB_HOST', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET']
for (const key of required){
    if (!process.env[key]){
        throw new Error(`Missing required environment variable: ${key}`)
    }
}

// webhook for stripe
app.use( '/api/payments/webhook', express.raw({ type: 'application/json' }))

// Middlewares
app.use(helmet())
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

//Routes

app.get('/health', (req, res) => {
    res.json(
        new ApiResponse(200, 
            {status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime()},
            'Server is healthy'
        )
    )
})

app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/payments', paymentRoutes)

app.use((req,res) => {
    res.status(404).json(
        new ApiResponse(404, null, `Route ${req.method} ${req.path} not found`)
    )
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Something went wrong'

    if (process.env.NODE_ENV === 'development'){
        console.error(err)
    }

    return res.status(statusCode).json(
        new ApiResponse(statusCode, null, message)
    )
})

async function start() {
  try {
    await initDB()
    await initElasticsearch()
    await connectProducer()
    await startIndexerConsumer(esClient) 
    app.listen(PORT, () => {
      console.log(`HireBoard API running on http://localhost:${PORT}`)
    })

  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

start()