import { AppError } from '../errors/index.js'

export const errorHandler = (err, _req, res, _next) => {
  // Si es un error de nuestra aplicación (AppError)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    })
  }

  // Error genérico o no controlado
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  console.error(`[ERROR] ${statusCode}: ${message}`)
  console.error(err.stack)

  return res.status(statusCode).json({
    message: statusCode === 500 ? 'Internal Server Error' : message,
  })
}
