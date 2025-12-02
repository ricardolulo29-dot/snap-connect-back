import { asyncHandler } from '../../utils/asyncHandler.js'

export class AuthController {
  constructor(authService) {
    this.authService = authService
  }

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const token = await this.authService.loginUser(email, password)
    return res.json({ token })
  })

  signup = asyncHandler(async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body
    const token = await this.authService.signUpUser(email, password, username, firstName, lastName)
    return res.json({ token })
  })
}
