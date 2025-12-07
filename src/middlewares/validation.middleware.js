export const validationMiddleware = schema => (req, res, next) => {
  const data = {
    body: req.body,
    params: req.params,
    query: req.query,
  }

  const { error } = schema.validate(data, {
    allowUnknown: true,
  })

  if (error)
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map(d => d.message),
    })

  next()
}
