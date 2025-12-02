import jwt from 'jsonwebtoken'
import { UsersRepository } from '../repositories/users.repository.js'
import { UnauthorizedError } from '../errors/index.js'

const usersRepository = new UsersRepository()

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    if (!authHeader) throw new UnauthorizedError('No token provided')

    const token = authHeader.split(' ')[1]
    if (!token) throw new UnauthorizedError('No token provided')

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await usersRepository.selectUserByEmail(decoded.email)

    if (!user) throw new UnauthorizedError('Invalid token')

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new UnauthorizedError('Invalid token'))
    } else if (error.name === 'TokenExpiredError') {
      next(new UnauthorizedError('Token expired'))
    } else {
      next(error)
    }
  }
}
