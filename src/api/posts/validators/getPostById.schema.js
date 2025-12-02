import Joi from 'joi'

const getPostByPostIdSchema = Joi.object({
  params: Joi.object({
    postId: Joi.string().required(),
  }),
})

export default getPostByPostIdSchema
