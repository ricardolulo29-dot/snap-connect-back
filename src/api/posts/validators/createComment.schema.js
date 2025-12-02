import Joi from 'joi'

const createCommentSchema = Joi.object({
  params: Joi.object({
    postId: Joi.string().required(),
  }),
  body: Joi.object({
    content: Joi.string().required(),
  }),
})

export default createCommentSchema
