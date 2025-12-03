import { NotFoundError, ForbiddenError } from '../../errors/index.js'
import { TagsRepository } from '../../repositories/tags.repository.js'

export class PostsService {
  constructor(postsRepository, likesRepository, commentsRepository, tagsRepository) {
    this.postsRepository = postsRepository
    this.likesRepository = likesRepository
    this.commentsRepository = commentsRepository
    this.tagsRepository = tagsRepository || new TagsRepository()
  }

  getPosts = async (userId, tags = []) => {
    if (tags.length > 0) {
      // Si hay tags, filtrar por tags
      const allPosts = []
      for (const tag of tags) {
        const tagPosts = await this.postsRepository.getPostsByTag(tag, userId)
        allPosts.push(...tagPosts)
      }
      // Eliminar duplicados por ID
      const uniquePosts = Array.from(new Map(allPosts.map(post => [post.id, post])).values())
      // Filtrar solo posts que tengan TODOS los tags
      if (tags.length > 1) {
        return uniquePosts
          .filter(post =>
            tags.every(tag =>
              post.tags?.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
            )
          )
          .sort((a, b) => b.createdAt - a.createdAt)
      }
      return uniquePosts.sort((a, b) => b.createdAt - a.createdAt)
    }

    // Si no hay tags, mostrar posts normales
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
    const postId = await this.postsRepository.savePost(title, content, image, userId)

    // Extraer y guardar tags
    const hashtags = this.extractHashtags(content)
    if (hashtags.length > 0) await this.tagsRepository.addTagsToPost(postId, hashtags)

    return { id: postId, message: 'Post created successfully' }
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

  extractHashtags(content) {
    const hashtagRegex = /#(\w+)/g
    const matches = content.match(hashtagRegex)
    if (!matches) return []

    // Remover el # y convertir a minúsculas, eliminar duplicados
    return [...new Set(matches.map(tag => tag.slice(1).toLowerCase()))]
  }
}
