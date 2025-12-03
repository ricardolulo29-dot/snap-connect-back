export class TagsService {
  constructor(tagsRepository) {
    this.tagsRepository = tagsRepository
  }

  getAllTags = async () => {
    return await this.tagsRepository.getAllTags()
  }
}
