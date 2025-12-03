import { asyncHandler } from '../../utils/asyncHandler.js'

export class ChatsController {
  constructor(chatsService) {
    this.chatsService = chatsService
  }

  getUserChats = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const chats = await this.chatsService.getUserChats(userId)
    return res.json(chats)
  })

  createChat = asyncHandler(async (req, res) => {
    const { userId: userIdWith } = req.body
    const userId = req.user.id
    const newChat = await this.chatsService.createChat(userId, userIdWith)
    return res.json(newChat)
  })

  getChatMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.params
    const messages = await this.chatsService.getChatMessages(chatId, req.user.id)
    return res.json(messages)
  })

  sendMessage = asyncHandler(async (req, res) => {
    const { chatId } = req.params
    const { content } = req.body
    const senderId = req.user.id

    const message = await this.chatsService.sendMessage(chatId, senderId, content)
    return res.json(message)
  })

  markMessagesAsRead = asyncHandler(async (req, res) => {
    const { chatId } = req.params
    const userId = req.user.id

    await this.chatsService.markMessagesAsRead(chatId, userId)
    return res.json({ message: 'Messages marked as read' })
  })

  deleteChat = asyncHandler(async (req, res) => {
    const { chatId } = req.params
    const userId = req.user.id

    await this.chatsService.deleteChat(chatId, userId)
    return res.json({ message: 'Chat deleted successfully' })
  })
}
