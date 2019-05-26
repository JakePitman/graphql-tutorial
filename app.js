const express = require('express')
const cors = require('cors')
//allows express to understand graphql
//this ends up being our 'one endpoint'?
const graphqlHTTP = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose')

const app = express()


mongoose.connect('mongodb://localhost/gql-ninja')
mongoose.connection.once('open', () => {
    console.log('connected to database')
})

app.use(cors())

//get's fired off when ever a request to /graphql is made
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(4000, () => {
    console.log('now listening for requests on port 4000')
})