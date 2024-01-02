import 'dotenv/config.js'

import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import session from 'express-session'

import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import roomRoutes from './routes/room.js'

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name:'meowmeow-session',
    cookie:{
        expires:1000000,
    },
}))

app.use(cors(
    {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        preflightContinue: false,
        credentials: true,
    }
))

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/room', roomRoutes)

export { app as webapp }