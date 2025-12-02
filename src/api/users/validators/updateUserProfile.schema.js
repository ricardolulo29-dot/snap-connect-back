import Joi from 'joi'

const updateUserProfileSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required(),
  }),
  body: Joi.object({
    username: Joi.string().min(3).max(30).optional(),
    firstName: Joi.string().min(2).max(50).optional(),
    lastName: Joi.string().min(2).max(50).optional(),
    email: Joi.string().email().optional(),
  }),
})

export default updateUserProfileSchema
