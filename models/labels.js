const mongoose = require('mongoose')
const Schema = mongoose.Schema

const labelSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    class: {
        type: String
    },
    isLabeled: {
        type: Boolean,
        default: false
    },
    videoTitle: {
        type: String,
        required: true
    },
    commentId: {
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

module.exports = mongoose.model("Label", labelSchema)