import { pool } from '../../database/pool.js'
import { Comment } from '../models/Comment.js'

export class CommentsRepository {
  async getCommentsByPost(postId) {
    const query = `
    SELECT 
      comments.id, 
      comments.content, 
      comments.post_id, 
      comments.user_id, 
      comments.created_at,
      users.username, 
      users.first_name,
      users.last_name,
      users.image as image_profile
    FROM comments 
    JOIN users ON comments.user_id = users.id
    WHERE comments.post_id = $1
  `
    const { rows } = await pool.query(query, [postId])
    return rows.map(Comment.fromDatabase)
  }

  async saveComment(postId, userId, content) {
    const query = `
    INSERT INTO comments (post_id, user_id, content) 
    VALUES ($1,$2,$3)
  `
    await pool.query(query, [postId, userId, content])
  }

  async deleteComment(postId, commentId, userId) {
    const query = `
    DELETE FROM comments 
    WHERE id = $1 AND post_id = $2 AND user_id = $3
  `
    await pool.query(query, [commentId, postId, userId])
  }
}
