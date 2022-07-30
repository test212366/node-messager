const Router = require('express'),
    router = new Router(),
    MessagesController = require('../controllers/MessagesController')

router.post('/updateMessages',  MessagesController.updateMessages )
router.post('/getMessages', MessagesController.getMessages)
router.post('/setAllMessages', MessagesController.setAllMessages)
module.exports = router