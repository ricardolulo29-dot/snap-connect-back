import { asyncHandler } from '../../utils/asyncHandler.js'

export class UsersController {
  constructor(usersService) {
    this.usersService = usersService
  }

  getUserProfile = asyncHandler(async (req, res) => {
    const { id } = req.params
    const profile = await this.usersService.getDetailedUserInfo(id)

    return res.json(profile)
  })

  getUserFollowers = asyncHandler(async (req, res) => {
    const { id } = req.params
    const followers = await this.usersService.getUserFollowers(id)

    return res.json(followers)
  })

  getUserFollowing = asyncHandler(async (req, res) => {
    const { id } = req.params
    const following = await this.usersService.getUserFollowing(id)

    return res.json(following)
  })

  followUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    const followerId = req.user.id

    await this.usersService.followUser(followerId, id)
    return res.json({ message: 'User followed successfully' })
  })

  unfollowUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    const followerId = req.user.id

    await this.usersService.unfollowUser(followerId, id)
    return res.json({ message: 'User unfollowed successfully' })
  })

  searchUsers = asyncHandler(async (req, res) => {
    const { query } = req.query
    const users = await this.usersService.searchUsers(query)
    return res.json(users)
  })

  updateUserImage = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { image } = req.body

    if (!image) return res.status(400).json({ message: 'Image is required' })

    const result = await this.usersService.updateUserImage(id, image)
    return res.json(result)
  })

  getUserImage = asyncHandler(async (req, res) => {
    const { id } = req.params
    const image = await this.usersService.getUserImage(id)

    return res.json(image)
  })

  updateUserProfile = asyncHandler(async (req, res) => {
    const { id } = req.params
    const requestUserId = req.user.id
    const updates = req.body

    const updatedUser = await this.usersService.updateUserProfile(
      parseInt(id),
      requestUserId,
      updates
    )
    return res.json(updatedUser)
  })
}
