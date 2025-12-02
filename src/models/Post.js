export class Post {
  constructor({
    id,
    title,
    content,
    image,
    userId,
    username,
    firstName,
    lastName,
    profileImage,
    createdAt,
    likesCount,
    isLikedByUser,
  }) {
    this.id = id
    this.title = title
    this.content = content
    this.image = image
    this.userId = userId
    this.author = {
      userId,
      username,
      firstName,
      lastName,
      profileImage,
    }
    this.createdAt = createdAt
    this.likesCount = likesCount || 0
    this.isLikedByUser = isLikedByUser || false
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      image: this.image,
      author: this.author,
      createdAt: this.createdAt,
      likesCount: this.likesCount,
      isLikedByUser: this.isLikedByUser,
    }
  }

  like() {
    this.likesCount++
    this.isLikedByUser = true
  }

  unlike() {
    this.likesCount = Math.max(0, this.likesCount - 1)
    this.isLikedByUser = false
  }

  canBeEditedBy(userId) {
    return this.author.userId === userId
  }

  canBeDeletedBy(userId) {
    return this.author.userId === userId
  }

  static fromDatabase(dbPost) {
    return new Post({
      id: dbPost.id,
      title: dbPost.title,
      content: dbPost.content,
      image: dbPost.image,
      userId: dbPost.user_id,
      username: dbPost.username,
      firstName: dbPost.first_name,
      lastName: dbPost.last_name,
      profileImage: dbPost.image_profile || dbPost.profile_image || dbPost.profileImage,
      createdAt: dbPost.created_at,
      likesCount: parseInt(dbPost.likes_count || 0),
      isLikedByUser: dbPost.is_liked_by_user || false,
    })
  }
}
