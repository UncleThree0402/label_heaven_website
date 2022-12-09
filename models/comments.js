const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    channel: {
        type: String,
        required: true
    },
    channelId: {
        type: String,
        required: true
    },
    videoId: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Comment", commentSchema)