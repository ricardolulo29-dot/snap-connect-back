import { asyncHandler } from '../../utils/asyncHandler.js'

export class PostsController {
  constructor(postsService) {
    this.postsService = postsService
  }

  getAllPosts = asyncHandler(async (req, res) => {
    const tags = req.query.tags
      ? Array.isArray(req.query.tags)
        ? req.query.tags
        : [req.query.tags]
      : []

    const response = await this.postsService.getPosts(req.user.id, tags)
    return res.json(response)
  })

  likePost = asyncHandler(async (req, res) => {
    const { postId } = req.params
    const response = await this.postsService.likePost(req.user.id, postId)
    return res.json(response)
  })

  unlikePost = asyncHandler(async (req, res) => {
    const { postId } = req.params
    const response = await this.postsService.unlikePost(req.user.id, postId)
    return res.json(response)
  })

  createPost = asyncHandler(async (req, res) => {
    const { title, content, image } = req.body
    const response = await this.postsService.createPost(title, content, image, req.user.id)
    return res.json(response)
  })

  deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params
    const response = await this.postsService.deletePost(req.user.id, postId)
    return res.json(response)
  })

  editPostContent = asyncHandler(async (req, res) => {
    const { postId } = req.params
    const { content: newContent } = req.body
    const response = await this.postsService.editPostContent(postId, newContent, req.user.id)
    return res.json(response)
  })

  getPostComments = asyncHandler(async (req, res) => {
    const { postId } = req.params
    const comments = await this.postsService.getPostComments(postId)
    return res.json(comments)
  })

  createPostComment = asyncHandler(async (req, res) => {
    const { postId } = req.params
    const { content } = req.body
    const response = await this.postsService.createPostComment(postId, req.user.id, content)
    return res.json(response)
  })

  deletePostComment = asyncHandler(async (req, res) => {
    const { postId, commentId } = req.params
    const response = await this.postsService.deletePostComment(postId, commentId, req.user.id)
    return res.json(response)
  })
}
