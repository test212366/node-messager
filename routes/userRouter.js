const Router = require('express'),
    router = new Router(),
    UserController = require('../controllers/UserController'),
    {body} = require('express-validator'),
    upload = require('../exceptions/multer')

router.post('/registration', body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    UserController.register)
router.get('/activate/:link', UserController.activate)
router.post('/login',body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}), UserController.login )
router.post('/loginGoogle', UserController.loginGoogle)
router.post('/findUser', UserController.findUser)
router.post('/getUserSearch', UserController.getUserSearch)
router.post('/setChats', UserController.setChats)
router.post('/updatePinnedChats', UserController.updatePinnedChats)
router.post('/setStatus', UserController.setStatus)
router.post('/setAvatar', upload.single('picture'),  UserController.setAvatar)
router.post('/uploadPhoto', upload.single('picture'),  UserController.uploadPhoto)
router.post('/uploadAudio', UserController.uploadAudio)
router.post('/setTodosinit', UserController.updateTodo)
router.post('/updateData', UserController.updateData)
router.post('/getUser', UserController.getUser)
module.exports = router