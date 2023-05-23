
const express = require('express')
const {graphqlHTTP} =require('express-graphql')
const {GraphQLSchema,GraphQLObjectType,GraphQLString, GraphQLList, GraphQLNonNull, GraphQLInt} = require('graphql')
const app=express()

const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]

const AuthorType = new GraphQLObjectType({
    name:"Author",
fields:()=>({
    id:{type:new GraphQLNonNull(GraphQLInt)},
    name:{type:GraphQLString},
    books:{type:new GraphQLList(BookType),
    resolve:(author)=> books.filter(book => book.authorId===author.id)
    }
}),
})
const BookType=new GraphQLObjectType({
    name:"Book",
    description:"List of Books",
    fields:()=>({
        id:{type:new GraphQLNonNull(GraphQLInt)},
        name:{
            type:new GraphQLNonNull(GraphQLString),

        },
        authorId:{type:new GraphQLNonNull(GraphQLInt)},
        author:{type : AuthorType,
         resolve:(book)=> authors.find(author=>author.id==book.authorId)
        
        }

    })


})
const RootTypeQuery =new GraphQLObjectType({
    name:"Query",
    description:"Root Query",
    fields:()=>(
        {
            book:{
                type: BookType,
                args:{id:{
                    type:GraphQLInt
                }},
                resolve:(parent,args)=>books.find(book=>book.id===args.id)
            },
            books:{
                type: new GraphQLList(BookType),
                resolve:()=>books
            },
            authors:{
                type: new GraphQLList(AuthorType),
                resolve:()=>authors
            },
            author:{
                type:  AuthorType,
                args:{id:{type:GraphQLInt}},
                resolve:(parent,args)=>authors.find(author=>author.id===args.id)
            }
        }
    )
})

const RootMutationType=new GraphQLObjectType({
    name:"mutation",
    description:"Root Mutation",
    fields:()=>({
     addBook:{
        type:BookType,
        args:{
            name:{type:GraphQLString},
            authorId:{type:GraphQLInt}
        },
        resolve:(parent,args)=>{
            const book = {
                id:books.length+1,
                name:args.name,
                authorId:args.authorId
            }
            books.push(book)
            return book
        }
     }
    })
})

const schema=new GraphQLSchema(
    {
        query:RootTypeQuery,
        mutation:RootMutationType
    }

)

app.use('/graph',graphqlHTTP({
    schema:schema,
    graphiql:true
}))

app.listen(5000,()=>console.log('serve is running'))