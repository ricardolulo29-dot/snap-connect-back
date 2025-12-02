import { pool } from '../../database/pool.js'

export class LikesRepository {
  async saveLike(userId, postId) {
    const query = `
    INSERT INTO likes (user_id,post_id) 
    VALUES ($1,$2)
  `
    await pool.query(query, [userId, postId])
  }

  async deleteLike(userId, postId) {
    const query = `
    DELETE FROM likes 
    WHERE user_id = $1 AND post_id = $2
  `
    await pool.query(query, [userId, postId])
  }
}
