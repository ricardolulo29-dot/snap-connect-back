import { NotFoundError, ConflictError, ForbiddenError } from '../../errors/index.js'

export class UsersService {
  constructor(usersRepository, postsRepository) {
    this.usersRepository = usersRepository
    this.postsRepository = postsRepository
  }

  async getDetailedUserInfo(id) {
    const user = await this.usersRepository.selectUserById(id)
    if (!user) throw new NotFoundError('User')

    const posts = await this.postsRepository.getPostsByUser(id)
    const likedPosts = await this.postsRepository.getPostsLikedByUser(id)

    return { ...user, posts, likedPosts }
  }

  async getUserFollowers(id) {
    const user = await this.usersRepository.selectUserById(id)
    if (!user) throw new NotFoundError('User')

    return this.usersRepository.getUserFollowers(id)
  }

  async getUserFollowing(id) {
    const user = await this.usersRepository.selectUserById(id)
    if (!user) throw new NotFoundError('User')

    return this.usersRepository.getUserFollowing(id)
  }

  async followUser(followerId, followedId) {
    const follower = await this.usersRepository.selectUserById(followerId)
    const followed = await this.usersRepository.selectUserById(followedId)
    if (!follower || !followed) throw new NotFoundError('User')

    return this.usersRepository.saveUserFollow(followerId, followedId)
  }

  async unfollowUser(followerId, followedId) {
    const follower = await this.usersRepository.selectUserById(followerId)
    const followed = await this.usersRepository.selectUserById(followedId)
    if (!follower || !followed) throw new NotFoundError('User')

    return this.usersRepository.deleteUserFollow(followerId, followedId)
  }

  async searchUsers(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') return []
    return this.usersRepository.searchUsers(searchTerm.trim())
  }

  async updateUserImage(userId, image) {
    const user = await this.usersRepository.selectUserById(userId)
    if (!user) throw new NotFoundError('User')

    await this.usersRepository.updateUserImage(userId, image)
    return { message: 'Image updated successfully' }
  }

  async getUserImage(userId) {
    const user = await this.usersRepository.selectUserById(userId)
    if (!user) throw new NotFoundError('User')

    return user.image
  }

  async updateUserProfile(userId, requestUserId, updates) {
    const user = await this.usersRepository.selectUserById(userId)
    if (!user) throw new NotFoundError('User')

    if (userId !== requestUserId) throw new ForbiddenError('You can only edit your own profile')

    if (updates.username && updates.username !== user.username) {
      const usernameExists = await this.usersRepository.checkUsernameExists(updates.username)
      if (usernameExists) throw new ConflictError('Username already exists')
    }

    if (updates.email && updates.email !== user.email) {
      const emailExists = await this.usersRepository.checkEmailExists(updates.email)
      if (emailExists) throw new ConflictError('Email already exists')
    }

    return this.usersRepository.updateUserProfile(userId, updates)
  }
}
