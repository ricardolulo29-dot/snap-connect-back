import { Router } from 'express'
import { TagsRepository } from '../../repositories/tags.repository.js'
import { TagsService } from './tags.service.js'
import { TagsController } from './tags.controller.js'
import { authMiddleware as auth } from '../../middlewares/auth.middleware.js'

const router = Router()

const tagsRepository = new TagsRepository()
const tagsService = new TagsService(tagsRepository)
const tagsController = new TagsController(tagsService)

router.get('/', auth, tagsController.getAllTags)

export default router
