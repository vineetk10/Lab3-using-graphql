const graphql = require('graphql');
const Item  = require("../Models/itemSchema");

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean
} = graphql;


const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
            }
        }
    })
});

const ItemType = new GraphQLObjectType({
    name: 'Item',
    fields: () => ({
        _id: { type: GraphQLID },
        categoryName: { type: GraphQLString },
        itemName: { type: GraphQLString },
        itemDescription: { type: GraphQLString },
        price: {type: GraphQLInt},
        quantity: {type: GraphQLInt},
        isFavorite: {type: GraphQLBoolean},
        salesCount: {type: GraphQLInt},
        itemImageUrl: { type: GraphQLString },
        owner: {type: GraphQLID}
// isFavorite:false
// itemDescription:'cake'
// itemImageUrl:'myImage-1650699851380-407516788'
// itemName:'cake1'
// owner:ObjectId {Symbol(id): Buffer(12)}
// price:30
// quantity:20
// salesCount:0
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Root Query',
    fields: {
        items: {
            type: new GraphQLList(ItemType),
            args: { id: { type: GraphQLID } },
            async resolve(parent, args) {
                return await Item.find({}).select({"_id":0})
                            .then((items)=>{
                                return items
                            })
                            .catch((err)=>{
                                return { error: "No item Found "+err }
                            })
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt },
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                let author = {
                    name: args.name,
                    age: args.age,
                    id: args.id
                };
                // authors.push(author)
                // console.log("Authors", authors);
                // return author;
            }
        },

        addBook: {
            type: BookType,
            args: {
                name: { type: GraphQLString },
                genre: { type: GraphQLString },
                authorId: { type: GraphQLID },
            },
            resolve(parent, args) {
                let book = {
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId,
                    // id: books.length+1
                }
                // books.push(book);
                // return book;
            }
        }

    }
});

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});

module.exports = schema;