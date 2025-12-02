import Joi from 'joi'

const createChatSchema = Joi.object({
  body: Joi.object({
    userId: Joi.number().required(),
  }),
})

export default createChatSchema
