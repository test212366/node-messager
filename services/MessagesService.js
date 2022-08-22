const MessagesModel = require('../models/messagesModel')
const getData = () => {
	const date = new Date(),
		newDate = new Date(3 * 60 * 60000 + date.valueOf() + 
								  (date.getTimezoneOffset() * 60000))
	 return newDate
}


class MessagesService {
     async updateMessages(idMessages, message) {
			const time = getData()
         const candidate = await MessagesModel.findOne({idMessages})
         if(candidate) {
             await MessagesModel.findOneAndUpdate({idMessages}, {$push: {messages: {...message, data: `${time}` }}})
         } else {
             const newDialog = new MessagesModel({
                 idMessages,
                 messages: [{...message, data: `${time}` }]
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