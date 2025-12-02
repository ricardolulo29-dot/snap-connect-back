import { NotFoundError, ForbiddenError } from '../../errors/index.js'

export class ChatsService {
  constructor(chatsRepository, usersRepository) {
    this.chatsRepository = chatsRepository
    this.usersRepository = usersRepository
  }

  getUserChats = async userId => {
    const user = await this.usersRepository.selectUserById(userId)
    if (!user) throw new NotFoundError('User')
    const chats = await this.chatsRepository.selectChatsByUserId(userId)
    return Promise.all(
      chats.map(async chat => ({
        ...chat,
        participants: await Promise.all(
          chat.participants.map(
            async participantId => await this.usersRepository.selectUserById(participantId)
          )
        ),
      }))
    )
  }

  createChat = async (userId1, userId2) => {
    const user1 = await this.usersRepository.selectUserById(userId1)
    const user2 = await this.usersRepository.selectUserById(userId2)
    if (!user1 || !user2) throw new NotFoundError('User')
    return this.chatsRepository.insertChat(userId1, userId2)
  }

  getChatMessages = async (chatId, userId) => {
    const chat = await this.chatsRepository.getChatById(chatId)
    if (!chat) throw new NotFoundError('Chat')
    if (!chat.hasParticipant(userId)) throw new ForbiddenError('You cannot access this chat')

    return this.chatsRepository.getMessagesByChatId(chatId)
  }

  sendMessage = async (chatId, senderId, content) => {
    const chat = await this.chatsRepository.getChatById(chatId)
    if (!chat) throw new NotFoundError('Chat')
    if (!chat.hasParticipant(senderId))
      throw new ForbiddenError('You cannot send messages to this chat')

    return this.chatsRepository.insertMessage(chatId, senderId, content)
  }

  markMessagesAsRead = async (chatId, userId) => {
    const chat = await this.chatsRepository.getChatById(chatId)
    if (!chat) throw new NotFoundError('Chat')
    if (!chat.hasParticipant(userId)) throw new ForbiddenError('You cannot access this chat')

    await this.chatsRepository.markMessagesAsRead(chatId, userId)

    return { message: 'Messages marked as read' }
  }
}
