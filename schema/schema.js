//three responsibilities of schema.js
//define types
//define relationships between types
//define root queries(how the user extracts data)

const graphql = require('graphql')
const _ = require('lodash')
const Book = require('../models/book')
const Author = require('../models/author')

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList} = graphql

const BookType = new GraphQLObjectType({
    name:'Book',
    //Need to return these values as a function
    //if we don't, it'll error because AuthorType hasn't been defined yet
    //by using a function, AuthorType won't try to be evaluated until the file has loaded..?
    fields: () => ({
        id: {type: GraphQLString },
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        author: {
            type: AuthorType,
            //parent, in this case, is the data from the current book being requested
            resolve(parent, args){
                return Author.findById(parent.authorId)
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name:'Author',
    fields: () => ({
        id: {type: GraphQLID },
        name: {type: GraphQLString},
        age: {type: GraphQLInt },
        books: { 
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return Book.find({authorId: parent.id})
            } 
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    //doesn't need to be wrapped in a fn
    fields: {
        book: {
            type: BookType,
            //when someone makes a book query, we expect an id as an arg
            args: { id: {type: GraphQLID} },
            //this is where we put the code to get data from db
            //args param is the same as the args property above
            //eg. we have access to args.id
            resolve(parent, args){
                //code to get data from db / other source
                return Book.findById(args.id)
            }
        },
        author: {
            type: AuthorType,
            args: {id:{ type: GraphQLID }},
            resolve(parent, args){
                return Author.findById(args.id)
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return Book.find({})
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                return Author.find({})
            }
        }
    },
})


const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            //args from post request
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt }
            },
            resolve(parent, args){
                //Author comes from the model
                //creating a new, local instance of Author
                let author = new Author({
                    name: args.name,
                    age: args.age
                })
                //.save is coming from mongoose
                return author.save()
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: GraphQLString},
                genre: { type: GraphQLString},
                authorId: { type: GraphQLID}
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    // authorid: args.authorId
                    author: Author.findById(args.authorId)
                })
                return book.save() 
            }
        }
    }
})

//the initial query of the schema
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})