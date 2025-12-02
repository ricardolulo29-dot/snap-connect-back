import Joi from 'joi'

const signupSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    username: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
  }),
})

export default signupSchema
