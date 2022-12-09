const mongoose = require('mongoose')
const Schema = mongoose.Schema

const videoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    channel: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    thumbnailUrl: {
        type: String,
        required: true
    },
    videoId: {
        type: String,
        required: true
    },
    datasetId: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Video", videoSchema)