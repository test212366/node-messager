const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: false},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    name: {type: String, required: true},
    chats: {type: Array, default: []},
    pinnedChats: {type: Array, default: []},
    nowChat: {type: String, default: ''},
    status: {type: String, default: ''},
    todo: {type: Array, default: []},
    avatarSRC: {type: String, default: ''},
    data: {type: Array, default: [{ name: '01', completed: 0, ongoing: 0, amt: 0 }]},
    online: {type: String, default: 'online'},
    token: {type: String, default: ''}
})
module.exports = model('User', UserSchema)