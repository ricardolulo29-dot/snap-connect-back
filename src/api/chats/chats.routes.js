import { Router } from 'express'
import { ChatsRepository } from '../../repositories/chats.repository.js'
import { UsersRepository } from '../../repositories/users.repository.js'
import { ChatsService } from './chats.service.js'
import { ChatsController } from './chats.controller.js'
import { authMiddleware as auth } from '../../middlewares/auth.middleware.js'
import { validationMiddleware } from '../../middlewares/validation.middleware.js'
import { getChatByIdSchema, createChatSchema, newMessageSchema } from './validators/index.js'

const router = Router()

const chatsRepository = new ChatsRepository()
const usersRepository = new UsersRepository()
const chatsService = new ChatsService(chatsRepository, usersRepository)
const chatsController = new ChatsController(chatsService)

const validationById = validationMiddleware(getChatByIdSchema)
const createChatValidation = validationMiddleware(createChatSchema)
const newMessageValidation = validationMiddleware(newMessageSchema)

router.get('/', auth, chatsController.getUserChats)
router.post('/', auth, createChatValidation, chatsController.createChat)
router.get('/:chatId/messages', auth, validationById, chatsController.getChatMessages)
router.post('/:chatId/messages', auth, newMessageValidation, chatsController.sendMessage)
router.patch('/:chatId/read', auth, validationById, chatsController.markMessagesAsRead)

export default router
