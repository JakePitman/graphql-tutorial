const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookSchema = new Schema({
    name: String,
    genre: String,
    authorId: String
})

//the model refers to a collection
module.exports = mongoose.model('Book', bookSchema)