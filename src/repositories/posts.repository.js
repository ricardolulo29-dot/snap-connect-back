import { pool } from '../../database/pool.js'
import { Post } from '../models/Post.js'

export class PostsRepository {
  // Obtener tags de múltiples posts de manera eficiente
  async getTagsForPosts(postIds) {
    if (postIds.length === 0) return {}

    const query = `
      SELECT post_tags.post_id, tags.name
      FROM post_tags
      JOIN tags ON post_tags.tag_id = tags.id
      WHERE post_tags.post_id = ANY($1)
    `
    const { rows } = await pool.query(query, [postIds])

    // Agrupar por post_id
    const tagsByPost = {}
    rows.forEach(row => {
      if (!tagsByPost[row.post_id]) tagsByPost[row.post_id] = []

      tagsByPost[row.post_id].push(row.name)
    })

    return tagsByPost
  }

  async savePost(title, content, image, userId) {
    const query = `
    INSERT INTO posts (title, content, image, user_id) 
    VALUES ($1,$2,$3,$4)
    RETURNING id
  `
    const { rows } = await pool.query(query, [title, content, image, userId])
    return rows[0].id
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

    // Obtener tags para todos los posts
    const postIds = rows.map(row => row.id)
    const tagsByPost = await this.getTagsForPosts(postIds)

    // Agregar tags a cada post
    return rows.map(row => Post.fromDatabase({ ...row, tags: tagsByPost[row.id] || [] }))
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
      COUNT(DISTINCT likes.user_id) AS likes_count,
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

    // Obtener tags para todos los posts
    const postIds = rows.map(row => row.id)
    console.log(
      'Post IDs obtenidos:',
      rows.map(post => ({ id: post.id, likesCount: post.likes_count }))
    ) // Agregado para depuración
    const tagsByPost = await this.getTagsForPosts(postIds)

    // Agregar tags a cada post
    return rows.map(row => Post.fromDatabase({ ...row, tags: tagsByPost[row.id] || [] }))
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
      COUNT(DISTINCT likes.user_id) AS likes_count,
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

    // Obtener tags para todos los posts
    const postIds = rows.map(row => row.id)
    const tagsByPost = await this.getTagsForPosts(postIds)

    // Agregar tags a cada post
    return rows.map(row => Post.fromDatabase({ ...row, tags: tagsByPost[row.id] || [] }))
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

  async getPostsByTag(tagName, userId) {
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
      BOOL_OR(likes.user_id = $2) AS is_liked_by_user,
      COUNT(DISTINCT comments.id) AS comments_count
    FROM posts
    JOIN users ON posts.user_id = users.id
    JOIN post_tags ON posts.id = post_tags.post_id
    JOIN tags ON post_tags.tag_id = tags.id
    LEFT JOIN likes ON posts.id = likes.post_id
    LEFT JOIN comments ON posts.id = comments.post_id
    WHERE tags.name = $1
    GROUP BY posts.id, users.username, users.first_name, users.last_name, users.image
    ORDER BY posts.created_at DESC
  `
    const { rows } = await pool.query(query, [tagName.toLowerCase(), userId])

    // Obtener tags para todos los posts
    const postIds = rows.map(row => row.id)
    const tagsByPost = await this.getTagsForPosts(postIds)

    // Agregar tags a cada post
    return rows.map(row => Post.fromDatabase({ ...row, tags: tagsByPost[row.id] || [] }))
  }
}
