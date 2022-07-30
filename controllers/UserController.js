const UserService = require('../services/UserService'),
    {validationResult} = require('express-validator'),
    {v2: cloudinary} = require("cloudinary"),
    multer = require('multer')

// for upload images in db cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})



class UserController {
    async register(req, res, next) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) return res.json({error: {errors, message: 'email не корректный'}})
            const {email, name, password} = req.body,
                user = await UserService.registration(email, name, password)
            return res.json(user)
        } catch (e) {
            console.log(e)
        }
    }
    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await UserService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL)
        } catch (e) {
            console.log(e)
        }
    }
    async login(req,res,next) {
        try {
            const {email, password} = req.body,
                user = await UserService.login(email, password)
            return res.json(user)
        } catch (e) {
            console.log(e)
        }
    }
    async loginGoogle(req,res,next) {
        try {
            const {name, email} = req.body,
                user = await UserService.loginGoogle(name, email)
            return res.json(user)
        } catch (e) {
            console.log(e)
        }
    }
    async findUser(req, res, next) {
        try {
            const {name} = req.body,
                user = await UserService.findUser(name)
            return res.json(user)
        }catch (e) {
            console.log(e)
        }
    }
    async getUserSearch(req,res,next) {
        try {
            const {name} = req.body,
                user = await UserService.getUserSearch(name)
            return res.json(user)
        } catch (e) {
            console.log(e)
        }
    }
    async setChats(req, res, next) {
        try {
            const {chats, name} = req.body
            await UserService.setChats(name, chats)
            return res.json({msg: 'complete'})
        }
         catch (e) {
            console.log(e)
        }
    }
    async updatePinnedChats(req,res, next) {
        try {
            const {name, pinnedChats} = req.body
            await UserService.updatePinnedChats(name, pinnedChats)
            return res.json({msg: 'complete'})
        } catch (e) {
            console.log(e)
        }
    }
    async setStatus(req, res, next) {
        try {
            const {name, status} = req.body
            await UserService.setStatus(name, status)
            return res.json({msg: 'complete'})
        } catch (e) {
            console.log(e)
        }
    }
    async setAvatar(req, res, next) {
        try {
          const picture = req.file.path,
              {name} = req.body
            await UserService.setAvatar(name, picture)
            return res.json({path: picture})
        } catch (e) {
            console.log(e)
        }
    }
    async uploadPhoto(req, res, next) {
        try {
            const picture = req.file.path
            return res.json({path: picture})
        } catch (e) {
            console.log(e)
        }
    }
    async uploadAudio(req, res, next) {
        try {
                // Get the file name and extension with multer
                const storage = multer.diskStorage({
                    filename: (req, file, cb) => {
                        const fileExt = file.originalname.split(".").pop(),
                            filename = `${new Date().getTime()}.${fileExt}`
                        cb(null, filename)
                    },
                })
                // Set the storage, file filter and file size with multer
                const upload = multer({
                    storage,
                    limits: {
                        fieldNameSize: 200,
                        fileSize: 5 * 1024 * 1024,
                    },
                }).single("audio")
                // upload to cloudinary
                upload(req, res, (err) => {
                    if (err) return res.send(err)
                    // SEND FILE TO CLOUDINARY
                    const { path } = req.file, // file becomes available in req at this point
                        fName = req.file.originalname.split(".")[0]
                    cloudinary.uploader.upload(
                        path,
                        {
                            resource_type: "raw",
                            public_id: `AudioUploads/${fName}`,
                        },
                        // Send cloudinary response or catch error
                        (err, audio) => {
                            if (err) return res.send(err)
                            res.send(audio)
                        }
                    )
                })
        } catch (e) {
            console.log(e)
        }
    }
    async updateTodo (req, res, next) {
        try {
            const {todos, name} = req.body
            await UserService.updateTodo(todos, name)
            return res.json({msg: 'complete'})
        } catch (e) {
            console.log(e)
        }
    }
    async updateData(req, res, next) {
        try {
            const {data, name} = req.body
            await UserService.updateData(data, name)
            return res.json({msg: 'complete'})
        } catch (e) {
            console.log(e)
        }
    }
    async getUser(req, res, next) {
        try {
            const {token} = req.body,
                user = await UserService.getUser(token)
            return res.json(user)
        } catch (e) {
            console.log(e)
        }
    }
}
module.exports = new UserController()