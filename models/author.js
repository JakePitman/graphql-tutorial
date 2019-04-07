const mongoose = require('mongoose')
const Schema = mongoose.Schema

const authorSchema = new Schema({
    name: String,
    age: Number
})

//the model refers to a collection
module.exports = mongoose.model('Author', authorSchema)