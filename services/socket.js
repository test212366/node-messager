const socketio = require('socket.io'),
    UserService = require('./UserService')


 const getData = () => {
		const date = new Date(),
			newDate = new Date(3 * 60 * 60000 + date.valueOf() + 
									  (date.getTimezoneOffset() * 60000))
		 return newDate
}
 


module.exports = server => {
    //all connections users
    const users = {},
        io = socketio(server)

    io.on('connection', async socket => {
        users[socket.handshake.query.name] = socket
        await UserService.updateOnline(socket.handshake.query.name, 'online' )
        // set online for user
        socket.on('CLIENT:USER_CHANGE_CHAT', async data => {
            // push room socket id room generated in uuid
            socket.join(data.query.roomId)
            //send one user emit for update nowChat in client
            users[data.query.userNameOn] && users[data.query.userNameOn].emit('SERVER:RESPONCE_USER_CHANGE_CHAT', {roomId: data.query.roomId, userAddedChat: data.query.userI})

            //send all users(one) emit in room
            data.query.userI && io.to(data.query.roomId).emit('SERVER:RESPONCE_USER_CHANGE_CHAT', {roomId: data.query.roomId, userAddedChat: data.query.userI})

            //update now chat connect user
            await UserService.updateNowChat(data.query.userI, data.query.roomId)
        })
        socket.on('CLIENT:SEND_MESSAGE_NO_IN_CHAT', message => {
 
            // responce send message for user who emit this message and view
            io.to(message.idChat).emit('SERVER:RESPONCE_CHAT_MESSAGE', {...message, data: `${getData()}`})
            // send user emit for update chats in client
            users[message.userNameOn] && users[message.userNameOn].emit('SERVER:RESPONCE_MESSAGE_NO_IN_CHAT', {...message, data})
        })
        socket.on('CLIENT:SEND_MESSAGE_IN_CHAT', message => {
 
            //send message for all users in room and update messages in client
            io.to(message.idChat).emit('SERVER:RESPONCE_CHAT_MESSAGE', {...message, data: `${getData()}`})
        })
        socket.on('CLIENT:TYPED', data => {
            //emit room typed in all users and update typed in client
            io.to(data.idChat).emit('SERVER:RESPONCE_TYPED', data)
        })
        // set offline for user
        socket.on('disconnect', async () => {
				
            await UserService.updateOnline(socket.handshake.query.name, getData() )
            //delete user disconnect
            delete users[socket.handshake.query.name]
        } )
    })
    return io
}
