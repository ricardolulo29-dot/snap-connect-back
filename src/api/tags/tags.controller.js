import { asyncHandler } from '../../utils/asyncHandler.js'

export class TagsController {
  constructor(tagsService) {
    this.tagsService = tagsService
  }

  getAllTags = asyncHandler(async (_, res) => {
    const tags = await this.tagsService.getAllTags()
    return res.json(tags)
  })
}
