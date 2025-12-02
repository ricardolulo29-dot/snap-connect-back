import Joi from 'joi'

const getPostByPostIdCommentIdSchema = Joi.object({
  params: Joi.object({
    postId: Joi.string().required(),
    commentId: Joi.string().required(),
  }),
})

export default getPostByPostIdCommentIdSchema
