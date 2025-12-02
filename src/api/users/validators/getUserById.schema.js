import Joi from 'joi'

const getUserByIdSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required(),
  }),
})

export default getUserByIdSchema
