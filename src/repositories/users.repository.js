import { pool } from '../../database/pool.js'
import { User } from '../models/User.js'

export class UsersRepository {
  async selectUserById(id) {
    const query = `SELECT id, username, email, first_name, last_name, image FROM users WHERE id = $1`
    const { rows } = await pool.query(query, [id])
    return rows.length ? User.fromDatabase(rows[0]) : null
  }

  async selectUserByEmail(email) {
    const query = `SELECT id, username, email, password, first_name, last_name FROM users WHERE email = $1`
    const { rows } = await pool.query(query, [email])
    return rows.length ? User.fromDatabase(rows[0]) : null
  }

  async getUserFollowers(userId) {
    const query = `
    SELECT users.id, users.username, users.first_name, users.last_name, users.image
    FROM users
    JOIN user_follows_user ON user_follows_user.follower_id = users.id
    WHERE user_follows_user.followed_id = $1
  `
    const { rows } = await pool.query(query, [userId])
    return rows.map(User.fromDatabase)
  }

  async getUserFollowing(userId) {
    const query = `
    SELECT users.id, users.username, users.first_name, users.last_name, users.image
    FROM users
    JOIN user_follows_user ON user_follows_user.followed_id = users.id
    WHERE user_follows_user.follower_id = $1
  `
    const { rows } = await pool.query(query, [userId])
    return rows.map(User.fromDatabase)
  }

  async saveUser(email, password, username, firstName, lastName) {
    const query = `
    INSERT INTO users (email, password, username, first_name, last_name) 
    VALUES ($1,$2,$3,$4,$5)
    RETURNING id, username, email, first_name, last_name, image
  `
    const { rows } = await pool.query(query, [email, password, username, firstName, lastName])
    return User.fromDatabase(rows[0])
  }

  async saveUserFollow(followerId, followedId) {
    const query = `INSERT INTO user_follows_user (follower_id, followed_id) VALUES ($1,$2)`
    await pool.query(query, [followerId, followedId])
  }

  async deleteUserFollow(followerId, followedId) {
    const query = `DELETE FROM user_follows_user WHERE follower_id = $1 AND followed_id = $2`
    await pool.query(query, [followerId, followedId])
  }

  async searchUsers(searchTerm) {
    const query = `
    SELECT id, username, email, first_name, last_name, image
    FROM users
    WHERE username ILIKE $1 OR first_name ILIKE $1 OR last_name ILIKE $1
    LIMIT 20
  `
    const { rows } = await pool.query(query, [`%${searchTerm}%`])
    return rows.map(User.fromDatabase)
  }

  async updateUserImage(userId, image) {
    const query = `UPDATE users SET image = $1 WHERE id = $2`
    await pool.query(query, [image, userId])
  }
}
