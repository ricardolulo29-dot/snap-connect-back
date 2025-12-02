import Joi from 'joi'

const newMessageSchema = Joi.object({
  params: Joi.object({
    chatId: Joi.string().required(),
  }),
  body: Joi.object({
    content: Joi.string().required(),
  }),
})

export default newMessageSchema
