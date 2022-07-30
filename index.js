require('dotenv').config()
const express = require('express'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser')

//get func set socket connect
const socket = require("./services/socket"),
    router = require('./routes/index')

const app = express()
app.use(cors({credentials: true, origin: process.env.CLIENT_URL}))
app.use(express.json({extended: true}))
app.use('/api', router)
app.use(bodyParser.json())
app.use(cookieParser())

// anon func ; - required else not work
;(async () => {
    try {
        //connect mongo db
        await mongoose.connect(process.env.DB_URL)
        const server = app.listen(process.env.PORT || 5000, () => console.log('SERVER STARTED'))
        //init socket routes
        socket(server)
    } catch (e) {
        console.log(e)
    }
})()