import Joi from 'joi'

const createPostSchema = Joi.object({
  body: Joi.object({
    title: Joi.string(),
    content: Joi.string(),
    image: Joi.string().required(),
  }),
})

export default createPostSchema
