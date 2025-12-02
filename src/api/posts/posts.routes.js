import { Router } from 'express'
import { PostsRepository } from '../../repositories/posts.repository.js'
import { LikesRepository } from '../../repositories/likes.repository.js'
import { CommentsRepository } from '../../repositories/comments.repository.js'
import { PostsService } from './posts.service.js'
import { PostsController } from './posts.controller.js'
import { authMiddleware as auth } from '../../middlewares/auth.middleware.js'
import { validationMiddleware } from '../../middlewares/validation.middleware.js'
import {
  createPostSchema,
  getPostByIdSchema,
  createCommentSchema,
  getPostByPostIdCommentIdSchema,
} from './validators/index.js'

const router = Router()

const postsRepository = new PostsRepository()
const likesRepository = new LikesRepository()
const commentsRepository = new CommentsRepository()
const postsService = new PostsService(postsRepository, likesRepository, commentsRepository)
const postsController = new PostsController(postsService)

const validationByIPostd = validationMiddleware(getPostByIdSchema)
const createValidation = validationMiddleware(createPostSchema)
const commentValidation = validationMiddleware(createCommentSchema)
const validationByIPostdCommentId = validationMiddleware(getPostByPostIdCommentIdSchema)

router.get('/', auth, postsController.getAllPosts)
router.post('/', auth, createValidation, postsController.createPost)
router.post('/:postId/like', auth, validationByIPostd, postsController.likePost)
router.post('/:postId/unlike', auth, validationByIPostd, postsController.unlikePost)
router.delete('/:postId', auth, validationByIPostd, postsController.deletePost)
router.patch('/:postId', auth, commentValidation, postsController.editPostContent)

router.post('/:postId/comments', auth, commentValidation, postsController.createPostComment)
router.get('/:postId/comments', auth, validationByIPostd, postsController.getPostComments)
router.delete(
  '/:postId/comments/:commentId',
  auth,
  validationByIPostdCommentId,
  postsController.deletePostComment
)

export default router
