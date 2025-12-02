import Joi from 'joi'

const getChatByIdSchema = Joi.object({
  params: Joi.object({
    chatId: Joi.string().required(),
  }),
})

export default getChatByIdSchema
