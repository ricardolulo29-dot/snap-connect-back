export class Comment {
  constructor({
    id,
    content,
    postId,
    userId,
    username,
    firstName,
    lastName,
    profileImage,
    createdAt,
  }) {
    this.id = id
    this.content = content
    this.postId = postId
    this.author = {
      userId,
      username,
      firstName,
      lastName,
      profileImage,
    }
    this.createdAt = createdAt
  }

  toJSON() {
    return {
      id: this.id,
      content: this.content,
      postId: this.postId,
      author: this.author,
      createdAt: this.createdAt,
    }
  }

  canBeDeletedBy(userId) {
    return this.author.userId === userId
  }

  static fromDatabase(dbComment) {
    return new Comment({
      id: dbComment.id,
      content: dbComment.content,
      postId: dbComment.post_id,
      userId: dbComment.user_id,
      username: dbComment.username,
      firstName: dbComment.first_name,
      lastName: dbComment.last_name,
      profileImage: dbComment.image_profile,
      createdAt: dbComment.created_at,
    })
  }
}
