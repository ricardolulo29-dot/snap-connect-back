import { NotFoundError, ForbiddenError } from '../../errors/index.js'

export class PostsService {
  constructor(postsRepository, likesRepository, commentsRepository) {
    this.postsRepository = postsRepository
    this.likesRepository = likesRepository
    this.commentsRepository = commentsRepository
  }

  getPosts = async userId => {
    const userPost = await this.postsRepository.getPostsByUser(userId)
    const followedPosts = await this.postsRepository.getPostsFollowedPosts(userId)
    return [...userPost, ...followedPosts].sort((a, b) => b.createdAt - a.createdAt)
  }

  likePost = async (userId, postId) => {
    await this.likesRepository.saveLike(userId, postId)
    return { message: 'Post liked successfully' }
  }

  unlikePost = async (userId, postId) => {
    await this.likesRepository.deleteLike(userId, postId)
    return { message: 'Post unliked successfully' }
  }

  createPost = async (title, content, image, userId) => {
    return this.postsRepository.savePost(title, content, image, userId)
  }

  deletePost = async (userId, postId) => {
    const post = await this.postsRepository.getPostById(postId)
    if (!post) throw new NotFoundError('Post')
    if (!post.canBeDeletedBy(userId)) throw new ForbiddenError('You cannot delete this post')

    await this.postsRepository.deletePostById(postId)
    return { message: 'Post deleted successfully' }
  }

  editPostContent = async (postId, newContent, userId) => {
    const post = await this.postsRepository.getPostById(postId)
    if (!post) throw new NotFoundError('Post')
    if (!post.canBeEditedBy(userId)) throw new ForbiddenError('You cannot edit this post')

    return this.postsRepository.editPostContent(postId, newContent)
  }

  getPostComments = async postId => {
    return this.commentsRepository.getCommentsByPost(postId)
  }

  createPostComment = async (postId, userId, content) => {
    return this.commentsRepository.saveComment(postId, userId, content)
  }

  deletePostComment = async (postId, commentId, userId) => {
    await this.commentsRepository.deleteComment(postId, commentId, userId)
    return { message: 'Comment deleted successfully' }
  }
}
