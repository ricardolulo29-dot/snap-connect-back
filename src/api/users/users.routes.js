import { Router } from 'express'
import { UsersController } from './users.controller.js'
import { UsersService } from './users.service.js'
import { UsersRepository } from '../../repositories/users.repository.js'
import { PostsRepository } from '../../repositories/posts.repository.js'
import { authMiddleware as auth } from '../../middlewares/auth.middleware.js'
import { validationMiddleware } from '../../middlewares/validation.middleware.js'
import { getUserByIdSchema, updateUserProfileSchema } from './validators/index.js'

const router = Router()

// Instanciar dependencias
const usersRepository = new UsersRepository()
const postsRepository = new PostsRepository()
const usersService = new UsersService(usersRepository, postsRepository)
const userController = new UsersController(usersService)

const validationById = validationMiddleware(getUserByIdSchema)
const validationUpdateProfile = validationMiddleware(updateUserProfileSchema)

router.get('/:id/profile', auth, validationById, userController.getUserProfile)
router.put('/:id/profile', auth, validationUpdateProfile, userController.updateUserProfile)
router.get('/:id/followers', auth, validationById, userController.getUserFollowers)
router.get('/:id/following', auth, validationById, userController.getUserFollowing)
router.post('/:id/follow', auth, validationById, userController.followUser)
router.delete('/:id/unfollow', auth, validationById, userController.unfollowUser)
router.get('/search', auth, userController.searchUsers)
router.put('/:id/image', auth, validationById, userController.updateUserImage)
router.get('/:id/image', auth, validationById, userController.getUserImage)

export default router
