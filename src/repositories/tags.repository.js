import { pool } from '../../database/pool.js'

export class TagsRepository {
  async getTag(tagName) {
    const normalizedTag = tagName.toLowerCase()
    const query = `SELECT id, name FROM tags WHERE name = $1`
    const { rows } = await pool.query(query, [normalizedTag])
    return rows.length ? rows[0] : null
  }

  async createTag(tagName) {
    const normalizedTag = tagName.toLowerCase()
    const query = `INSERT INTO tags (name) VALUES ($1) RETURNING id, name`
    const { rows } = await pool.query(query, [normalizedTag])
    return rows[0]
  }

  // Obtener o crear un tag
  async getOrCreateTag(tagName) {
    const normalizedTag = tagName.toLowerCase()

    const tag = await this.getTag(normalizedTag)
    if (tag) return tag

    return this.createTag(normalizedTag)
  }

  // Asociar tags con un post
  async addTagsToPost(postId, tagNames) {
    for (const tagName of tagNames) {
      const tag = await this.getOrCreateTag(tagName)

      // Insertar relación (ignorar si ya existe)
      const query = `
        INSERT INTO post_tags (post_id, tag_id)
        VALUES ($1, $2)
        ON CONFLICT (post_id, tag_id) DO NOTHING
      `
      await pool.query(query, [postId, tag.id])
    }
  }

  // Obtener tags de un post
  async getPostTags(postId) {
    const query = `
      SELECT tags.name
      FROM tags
      JOIN post_tags ON tags.id = post_tags.tag_id
      WHERE post_tags.post_id = $1
    `
    const { rows } = await pool.query(query, [postId])
    return rows.map(row => row.name)
  }

  // Obtener todos los tags con conteo de posts
  async getAllTags() {
    const query = `
      SELECT tags.name, COUNT(post_tags.post_id) as post_count
      FROM tags
      LEFT JOIN post_tags ON tags.id = post_tags.tag_id
      GROUP BY tags.id, tags.name
      HAVING COUNT(post_tags.post_id) > 0
      ORDER BY post_count DESC, tags.name ASC
    `
    const { rows } = await pool.query(query)
    return rows
  }
}
