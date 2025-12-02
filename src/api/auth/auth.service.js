import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { NotFoundError, UnauthorizedError, ConflictError } from '../../errors/index.js'

export class AuthService {
  constructor(usersRepository) {
    this.usersRepository = usersRepository
  }

  loginUser = async (email, password) => {
    const user = await this.usersRepository.selectUserByEmail(email)
    if (!user) throw new NotFoundError('User')
    if (!(await this.checkPassword(password, user.password)))
      throw new UnauthorizedError('Incorrect password')

    return this.generateToken(user)
  }

  signUpUser = async (email, password, username, firstName, lastName) => {
    const user = await this.usersRepository.selectUserByEmail(email)
    if (user) throw new ConflictError('User already exists')

    const newUser = await this.usersRepository.saveUser(
      email,
      await this.createHashPassword(password),
      username,
      firstName,
      lastName
    )

    return this.generateToken(newUser)
  }

  generateToken = user => {
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )
  }

  createHashPassword = async password => {
    return bcrypt.hash(password, 10)
  }

  checkPassword = async (password, hash) => {
    return bcrypt.compare(password, hash)
  }
}
