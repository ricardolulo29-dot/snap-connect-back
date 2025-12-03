import express from 'express'
import usersRoutes from './api/users/users.routes.js'
import authRoutes from './api/auth/auth.routes.js'
import postsRoutes from './api/posts/posts.routes.js'
import chatsRoutes from './api/chats/chats.routes.js'
import tagsRoutes from './api/tags/tags.routes.js'
import cors from 'cors'
import { errorHandler } from './middlewares/error.middleware.js'

const app = express()

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cors()) // Para habilitar la política (CORS)

// Exposición de los dominios de la API
app.use('/auth', authRoutes)
app.use('/users', usersRoutes)
app.use('/posts', postsRoutes)
app.use('/chats', chatsRoutes)
app.use('/tags', tagsRoutes)

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler)

export default app
