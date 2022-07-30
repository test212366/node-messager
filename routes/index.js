const Router = require('express'),
    router = new Router(),
    UserRouter = require('./userRouter'),
    MessagesRouter = require('./messagesRouter')

router.use('/user', UserRouter)
router.use('/messages', MessagesRouter)

module.exports = router