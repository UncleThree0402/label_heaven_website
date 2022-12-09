const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DatasetSchema = new Schema({
    title : {
        type : String,
        required: true
    },
    description : {
        type : String
    },
    class : {
        type : [String],
        required: true
    }
})

module.exports = mongoose.model('Dataset', DatasetSchema)