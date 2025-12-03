import { pool } from '../../database/pool.js'
import { Post } from '../models/Post.js'

export class PostsRepository {
  async savePost(title, content, image, userId) {
    const query = `
    INSERT INTO posts (title, content, image, user_id) 
    VALUES ($1,$2,$3,$4)
  `
    await pool.query(query, [title, content, image, userId])
  }

  async getPostsFollowedPosts(userId) {
    const query = `
    SELECT 
      posts.id, 
      posts.title, 
      posts.content, 
      posts.image, 
      posts.user_id, 
      users.username, 
      users.first_name,
      users.last_name, 
      users.image as image_profile,
      posts.created_at,
      COUNT(DISTINCT likes.user_id) AS likes_count,
      BOOL_OR(likes.user_id = $1) AS is_liked_by_user,
      COUNT(DISTINCT comments.id) AS comments_count
    FROM posts 
    JOIN users ON posts.user_id = users.id
    JOIN user_follows_user ON user_follows_user.followed_id = posts.user_id
    LEFT JOIN likes ON posts.id = likes.post_id 
    LEFT JOIN comments ON posts.id = comments.post_id
    WHERE user_follows_user.follower_id = $1
    GROUP BY posts.id, users.username, users.first_name, users.last_name, users.image
    ORDER BY posts.created_at DESC
  `
    const { rows } = await pool.query(query, [userId])
    return rows.map(Post.fromDatabase)
  }

  async getPostsByUser(userId) {
    const query = `
    SELECT 
      posts.id, 
      posts.title, 
      posts.content, 
      posts.image, 
      posts.user_id, 
      users.username, 
      users.first_name,
      users.last_name, 
      users.image as image_profile,
      posts.created_at, 
      COUNT(likes.user_id) AS likes_count,
      BOOL_OR(likes.user_id = $1) AS is_liked_by_user,
      COUNT(DISTINCT comments.id) AS comments_count
    FROM posts 
    JOIN users ON posts.user_id = users.id
    LEFT JOIN likes ON posts.id = likes.post_id 
    LEFT JOIN comments ON posts.id = comments.post_id
    WHERE posts.user_id = $1
    GROUP BY posts.id, users.username, users.first_name, users.last_name, users.image
    ORDER BY posts.created_at DESC
  `
    const { rows } = await pool.query(query, [userId])
    return rows.map(Post.fromDatabase)
  }

  async getPostsLikedByUser(userId) {
    const query = `
    SELECT 
      posts.id, 
      posts.title, 
      posts.content, 
      posts.image, 
      posts.user_id, 
      users.username, 
      users.first_name,
      users.last_name,      
      users.image as image_profile,
      posts.created_at, 
      COUNT(likes.user_id) AS likes_count,
      BOOL_OR(likes.user_id = $1) AS is_liked_by_user,
      COUNT(DISTINCT comments.id) AS comments_count
    FROM posts 
    JOIN users ON posts.user_id = users.id
    JOIN likes on posts.id = likes.post_id 
    LEFT JOIN comments ON posts.id = comments.post_id
    WHERE likes.user_id = $1
    GROUP BY posts.id, users.username, users.first_name, users.last_name, users.image
    ORDER BY posts.created_at DESC
  `
    const { rows } = await pool.query(query, [userId])
    return rows.map(Post.fromDatabase)
  }

  async deletePostById(postId) {
    const query = `DELETE FROM posts WHERE id = $1`
    await pool.query(query, [postId])
  }

  async getPostById(postId) {
    const query = `
    SELECT *
    FROM posts  
    WHERE posts.id = $1
  `
    const { rows } = await pool.query(query, [postId])
    return rows.length ? Post.fromDatabase(rows[0]) : null
  }

  async editPostContent(postId, content) {
    const query = `
    UPDATE posts 
    SET content = $1
    WHERE id = $2
  `
    await pool.query(query, [content, postId])
  }
}
