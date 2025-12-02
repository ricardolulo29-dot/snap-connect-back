import { Router } from 'express'
import { UsersRepository } from '../../repositories/users.repository.js'
import { AuthService } from './auth.service.js'
import { AuthController } from './auth.controller.js'
import { validationMiddleware } from '../../middlewares/validation.middleware.js'
import { loginSchema, signupSchema } from './validators/index.js'

const router = Router()

const usersRepository = new UsersRepository()
const authService = new AuthService(usersRepository)
const authController = new AuthController(authService)

const loginValidation = validationMiddleware(loginSchema)
const signupValidation = validationMiddleware(signupSchema)

router.post('/login', loginValidation, authController.login)
router.post('/signup', signupValidation, authController.signup)

export default router
