// Dependency Injection Container
import { UsersRepository } from '../repositories/users.repository.js'
import { PostsRepository } from '../repositories/posts.repository.js'
import { LikesRepository } from '../repositories/likes.repository.js'
import { CommentsRepository } from '../repositories/comments.repository.js'
import { ChatsRepository } from '../repositories/chats.repository.js'

import { UsersService } from '../api/users/users.service.js'
import { PostsService } from '../api/posts/posts.service.js'
import { AuthService } from '../api/auth/auth.service.js'
import { ChatsService } from '../api/chats/chats.service.js'

import { UsersController } from '../api/users/users.controller.js'
import { PostsController } from '../api/posts/posts.controller.js'
import { AuthController } from '../api/auth/auth.controller.js'
import { ChatsController } from '../api/chats/chats.controller.js'

// Repositories (Singletons)
export const usersRepository = new UsersRepository()
export const postsRepository = new PostsRepository()
export const likesRepository = new LikesRepository()
export const commentsRepository = new CommentsRepository()
export const chatsRepository = new ChatsRepository()

// Services (Singletons with injected dependencies)
export const usersService = new UsersService(usersRepository, postsRepository)
export const postsService = new PostsService(postsRepository, likesRepository, commentsRepository)
export const authService = new AuthService(usersRepository)
export const chatsService = new ChatsService(chatsRepository, usersRepository)

// Controllers (Singletons with injected services)
export const usersController = new UsersController(usersService)
export const postsController = new PostsController(postsService)
export const authController = new AuthController(authService)
export const chatsController = new ChatsController(chatsService)
