export class Message {
  constructor({ id, chatId, senderId, content, read, createdAt }) {
    this.id = id
    this.chatId = chatId
    this.senderId = senderId
    this.content = content
    this.read = read || false
    this.createdAt = createdAt
  }

  toJSON() {
    return {
      id: this.id,
      chatId: this.chatId,
      senderId: this.senderId,
      content: this.content,
      read: this.read,
      createdAt: this.createdAt,
    }
  }

  markAsRead() {
    this.read = true
  }

  static fromDatabase(dbMessage) {
    return new Message({
      id: dbMessage.id,
      chatId: dbMessage.chat_id,
      senderId: dbMessage.sender_id,
      content: dbMessage.content,
      read: dbMessage.read || false,
      createdAt: dbMessage.created_at,
    })
  }
}
