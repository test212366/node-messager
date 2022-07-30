const MessagesService = require('../services/MessagesService')

class MessagesController {
    async updateMessages(req, res, next) {
        try {
            const {idMessages, message} = req.body
                await MessagesService.updateMessages(idMessages,message)
            return res.json({msg: 'complete'})
        } catch(e) {
            console.log(e)
        }
    }
    async getMessages(req, res, next) {
        try {
            const {idMessages} = req.body,
                dialog = await MessagesService.getMessages(idMessages)
            return res.json(dialog)
        } catch (e) {
            console.log(e)
        }
    }
    async setAllMessages(req, res, next) {
        try {
            const {idMessages, messages} = req.body
            await MessagesService.setAllMessages(idMessages, messages)
            return res.json({msg: 'complete'})
        } catch (e) {
            console.log(e)
        }
    }
}
module.exports = new MessagesController()