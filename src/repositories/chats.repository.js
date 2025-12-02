import { pool } from '../../database/pool.js'
import { Chat } from '../models/Chat.js'
import { Message } from '../models/Message.js'

export class ChatsRepository {
  async selectChatsByUserId(userId) {
    const query = `
    SELECT 
      chats.id,
      chats.created_at,
      ARRAY[
        $1,
        CASE 
          WHEN chats.user_one_id = $1 THEN chats.user_two_id
          ELSE chats.user_one_id
        END
      ] AS participants,
      COUNT(messages.id) FILTER (WHERE messages.sender_id != $1 AND messages.read = FALSE) AS unread_count
    FROM chats
    LEFT JOIN messages ON messages.chat_id = chats.id
    WHERE chats.user_one_id = $1 OR chats.user_two_id = $1
    GROUP BY chats.id
    ORDER BY chats.created_at DESC
  `
    const { rows } = await pool.query(query, [userId])
    return rows.map(Chat.fromDatabase)
  }

  async insertChat(userId1, userId2) {
    const query = `
    INSERT INTO chats (user_one_id, user_two_id) 
    VALUES ($1,$2)
    RETURNING id, created_at, ARRAY[user_one_id, user_two_id] AS participants
  `
    const { rows } = await pool.query(query, [userId1, userId2])
    return rows.length ? Chat.fromDatabase(rows[0]) : null
  }

  async getChatById(chatId) {
    const query = `
    SELECT c.id, c.created_at, ARRAY[c.user_one_id, c.user_two_id] AS participants
    FROM chats c
    WHERE c.id = $1
  `
    const { rows } = await pool.query(query, [chatId])
    return rows.length ? Chat.fromDatabase(rows[0]) : null
  }

  async getMessagesByChatId(chatId) {
    const query = `
    SELECT id, chat_id, sender_id, content, created_at
    FROM messages
    WHERE chat_id = $1
    ORDER BY created_at ASC
  `
    const { rows } = await pool.query(query, [chatId])
    return rows.map(Message.fromDatabase)
  }

  async insertMessage(chatId, senderId, content) {
    const query = `
    INSERT INTO messages (chat_id, sender_id, content)
    VALUES ($1, $2, $3)
    RETURNING id, chat_id, sender_id, content, created_at
  `
    const { rows } = await pool.query(query, [chatId, senderId, content])
    return Message.fromDatabase(rows[0])
  }

  async markMessagesAsRead(chatId, userId) {
    const query = `
    UPDATE messages
    SET read = TRUE
    WHERE chat_id = $1 AND sender_id != $2 AND read = FALSE
  `
    await pool.query(query, [chatId, userId])
  }
}
