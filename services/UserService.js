const UserDto = require('../dto/userDto'),
    UserModel = require('../models/userModel'),
    bcrypt = require('bcrypt'),
    mailService = require('./mailService'),
    uuid = require('uuid'),
    tokenService = require('../services/tokenService'),
    jwt = require('jsonwebtoken')



const generateJwt = (id, email) => {
    return jwt.sign({ id, email }, 'fdsjlk lsfdlkj lsdk',
        { expiresIn: '48h' })
}

class UserService {
    async registration(email, name, password) {
        const candidate = await UserModel.findOne({email})
        if (candidate) return { error: "email уже используется" }
        const usedName = await UserModel.findOne({ name })
        if (usedName) return { error: 'имя пользователя уже используется' }
        const hashPassword = await bcrypt.hash(password, 3),
            activationLink = uuid.v4(),
            user = await UserModel.create({
                email, name, password: hashPassword, activationLink
            })
        await mailService.sendActivationEmail(email, `${process.env.API_URL}/api/user/activate/${activationLink}`)
        const userDto = new UserDto(user),
            tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {
            ...tokens,
            user
        }
    }
    async activate (activationLink) {
        const user = await UserModel.findOne({activationLink})
        if(!user) return {error: 'Ссылка подтверждения не верная'}
        user.isActivated = true
        await user.save()
    }
    async login(email, password) {

         const user = await UserModel.findOne({ email })
            if (!user) return { error: 'email не используется, пользователь не найден..' }
            const comparePassword = bcrypt.compareSync(password, user.password)
            if (!comparePassword) return { error: 'не действительный пароль' }
        const userDto = new UserDto(user),
            tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        if(!user.isActivated) {
            const activationLink = uuid.v4()
            await mailService.sendActivationEmail(email, `${process.env.API_URL}/api/user/activate/${activationLink}`)
        }
        return {
            ...tokens,
            user
        }
    }
    async loginGoogle(name,email) {
        const user = await UserModel.findOne({ email })
        if (user) {
            const userDto = new UserDto(user),
                tokens = tokenService.generateTokens({...userDto})
            return { user, tokens }
        } else {
            const user = await UserModel.create({
                email, name, password: '', isActivated: true
            }),
                userDto = new UserDto(user),
                tokens = tokenService.generateTokens({...userDto})
            return { user, tokens }
        }
    }
    async findUser(name) {
            const user = await UserModel.findOne({name})
            if (user) return user
            return { error: 'Пользователь не найден' }
    }
    async getUserSearch(name) {
        const user = await UserModel.findOne({name})
        return user
    }
    async updateOnline(name, online) {
        await UserModel.findOneAndUpdate({name}, {online: online})
        await UserModel.findOneAndUpdate({name}, {nowChat: ''})
    }
    async updateNowChat(name, id) {
        await UserModel.findOneAndUpdate({name}, {nowChat: id})
    }
    async setChats(name, chats) {
        await UserModel.findOneAndUpdate({name}, {chats})
    }
    async updatePinnedChats(name, pinnedChats) {
        await UserModel.findOneAndUpdate({name}, {pinnedChats})
    }
    async setStatus(name, status) {
        await UserModel.findOneAndUpdate({name}, {status})
    }
    async setAvatar(name, urlAvatar) {
        await UserModel.findOneAndUpdate({name}, {avatarSRC: urlAvatar})
    }
    async updateTodo(todos, name) {
        await UserModel.findOneAndUpdate({name}, {todo: todos})
    }
    async updateData(data, name) {
        await UserModel.findOneAndUpdate({name}, {data})
    }
    async getUser(token) {
        const decode = jwt.decode(token),
            userFind = await UserModel.findById(decode.id),
            tokenNew = generateJwt(userFind._id, userFind.name)

        if (userFind) return { user: userFind, token: tokenNew }
        else return { error: 'Токен не действительный' }

    }
}

module.exports = new UserService()