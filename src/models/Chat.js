export class Chat {
  constructor({ id, participants, createdAt, unreadCount }) {
    this.id = id
    this.participants = participants || []
    this.createdAt = createdAt
    this.unreadCount = unreadCount || 0
  }

  toJSON() {
    return {
      id: this.id,
      participants: this.participants,
      createdAt: this.createdAt,
      unreadCount: this.unreadCount,
    }
  }

  hasParticipant(userId) {
    return this.participants.some(p => (typeof p === 'object' ? p.id === userId : p === userId))
  }

  static fromDatabase(dbChat) {
    return new Chat({
      id: dbChat.id,
      participants: dbChat.participants,
      createdAt: dbChat.created_at,
      unreadCount: parseInt(dbChat.unread_count || 0),
    })
  }
}
