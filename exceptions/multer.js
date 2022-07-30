const multer = require('multer')
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const {v2: cloudinary} = require("cloudinary");

module.exports = cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary,
})

const upload = multer({storage,
    resource_type: "auto"
})
module.exports = upload