const MessagesModel = require('../models/messagesModel')

class MessagesService {
     async updateMessages(idMessages, message) {
         const candidate = await MessagesModel.findOne({idMessages})
         if(candidate) {
             await MessagesModel.findOneAndUpdate({idMessages}, {$push: {messages: {...message, data: `${new Date()}` }}})
         } else {
             const newDialog = new MessagesModel({
                 idMessages,
                 messages: [{...message, data: `${new Date()}` }]
             })
             await newDialog.save()
         }
     }
     async getMessages (idMessages) {
         const dialog = await MessagesModel.findOne({idMessages})
         return dialog
     }
     async setAllMessages (idMessages, messages) {
         await MessagesModel.findOneAndUpdate({idMessages}, {messages})
     }
}

module.exports = new MessagesService()