const {Schema, model} = require('mongoose')

const MessagesSchema = new Schema({
    idMessages: {type: String, required: true},
    messages: {type: Array, default: []}
})
module.exports = model('Messages', MessagesSchema)