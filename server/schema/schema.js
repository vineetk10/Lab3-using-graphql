const graphql = require('graphql');
const Item = require("../Models/itemSchema");
const User = require("../Models/userSchema");
const multer = require('multer');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLInputObjectType
} = graphql;

const { uploadFile } = require('../s3')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/home/ec2-user/Lab2/client/public/images')
        // cb(null, '/Users/vineetkarmiani/Documents/sjsu/Classes/Sem2/273/Lab1/client/public/images')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({ storage: storage, limits: '50mb' }).single('myImage');



const ItemType = new GraphQLObjectType({
    name: 'Item',
    fields: () => ({
        _id: { type: GraphQLID },
        categoryName: { type: GraphQLString },
        itemName: { type: GraphQLString },
        itemDescription: { type: GraphQLString },
        price: { type: GraphQLInt },
        quantity: { type: GraphQLInt },
        isFavorite: { type: GraphQLBoolean },
        salesCount: { type: GraphQLInt },
        itemImageUrl: { type: GraphQLString },
        owner: { type: GraphQLID }
    })
});

const OrderType = new GraphQLObjectType({
    name: 'Order',
    fields: ()=>({
        _id: { type: GraphQLID },
        orderDate: {type: GraphQLString},
        items: {type: new GraphQLList(ItemType)}
    })
})

const PurchaseType = new GraphQLObjectType({
    name: 'Purchase',
    fields: ()=>({
        _id: { type: GraphQLID },
        orders: {type: new GraphQLList(OrderType)}
    })
})

const ItemInputType = new GraphQLInputObjectType({
    name: 'InputItem',
    fields: () => ({
        count: { type: GraphQLInt },
        isFavorite: { type: GraphQLBoolean },
        itemDescription: { type: GraphQLString },
        itemImageUrl: { type: GraphQLString },
        itemName: { type: GraphQLString },
        price: { type: GraphQLInt },
        quantity: { type: GraphQLInt },
        salesCount: { type: GraphQLInt },
        // __typename: { type: GraphQLString }
    })
});


const FavItemType = new GraphQLObjectType({
    name: 'FavItem',
    fields: () => ({
        _id: { type: GraphQLID },
        categoryName: { type: GraphQLString },
        itemName: { type: GraphQLString },
        itemDescription: { type: GraphQLString },
        price: { type: GraphQLInt },
        quantity: { type: GraphQLInt },
        isFavorite: { type: GraphQLBoolean },
        salesCount: { type: GraphQLInt },
        itemImageUrl: { type: GraphQLString },
        isGift: { type: GraphQLBoolean },
        note: { type: GraphQLString },
        owner: { type: GraphQLID }
    })
});

const successType = new GraphQLObjectType({
    name: 'success',
    fields: () => ({
        successMessage: { type: GraphQLString }
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
                return await Item.find({}).select({ "_id": 0 })
                    .then((items) => {
                        return items
                    })
                    .catch((err) => {
                        return { error: "No item Found " + err }
                    })
            }
        },
        itemsOfOtherShops: {
            type: new GraphQLList(ItemType),
            args: { UserId: { type: GraphQLID } },
            async resolve(parent, args) {
                return await Item.find({ owner: { $ne: args.UserId } })
                    .then((items) => {
                        return items
                    })
                    .catch((err) => {
                        return { error: "No item Found " + err }
                    })
            }
        },
        favoriteItems: {
            type: new GraphQLList(FavItemType),
            args: { UserId: { type: GraphQLID } },
            async resolve(parent, args) {
                return await User.findOne({ _id: args.UserId }, "favorite")
                    .then((items) => {
                        return items._doc.favorite
                    })
                    .catch((err) => {
                        return { error: "No item Found " + err }
                    })
            }
        },
        purchases: {
            type: PurchaseType,
            args: {
                UserId: { type: GraphQLID }
            },
            async resolve(parent, args) {
                let orders = await User.findOne({_id: args.UserId},"orders")
                .then((orders)=>{
                    return orders;
                })
                .catch((err)=>{
                    console.log(err)
                })
                return orders;
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addItem: {
            type: successType,
            args: {
                UserId: { type: GraphQLID },
                Name: { type: GraphQLString },
                Description: { type: GraphQLString },
                Price: { type: GraphQLString },
                Quantity: { type: GraphQLString }
            },
            async resolve(parent, args) {
                let newItemObj = { "owner": args.UserId, "itemName": args.Name, "itemDescription": args.Description, "price": args.Price, "quantity": args.Quantity };
                let item = new Item(newItemObj);
                let itemId = await item.save()
                    .then((item) => {
                        return item._id;
                    })
                    .catch((err) => {
                        return { successMessage: "Saved saved unsuccessfully" };
                        //     return res.status(400).json({
                        //       err: "NOT able to save item in DB"+"Error is"+err
                        //   });
                    })

                let newItem = { "itemId": itemId, "itemName": args.Name, "itemDescription": args.Description, "price": args.Price, "quantity": args.Quantity };
                await User.updateOne({ _id: args.UserId },
                    { "$push": { 'shop.items': newItem } })
                    .then((docs) => {
                        console.log("Updated Docs : ", docs);
                    })
                    .catch((err) => {
                        console.log(err)
                    })

                return { successMessage: "Saved Successfully" };
                // upload(req, res, async function (err) {
                //     if (err instanceof multer.MulterError) {
                //         return res.json({message: err});
                //     } else if (err) {
                //         return res.json({message: "Upload failed "+err});
                //     }
                //     else
                //     {
                //         //   const result = await uploadFile(req.file);
                //           console.log(result);
                //           let newItemObj = {"owner":args.UserId,"itemName":args.Name,"itemDescription":args.Description,"price":args.Price,"quantity":args.Quantity,"itemImageUrl":result.Key};
                //           let item = new Item(newItemObj);
                //           let itemId = await item.save()
                //                         .then((item)=>{
                //                           return item._id;
                //                         })
                //                         .catch((err)=>{
                //                           return res.status(400).json({
                //                             err: "NOT able to save item in DB"+"Error is"+err
                //                         });
                //                         })

                //           let newItem = {"itemId":itemId,"itemName":args.Name,"itemDescription":args.Description,"price":args.Price,"quantity":args.Quantity};
                //           await User.updateOne({_id:args.UserId}, 
                //             {"$push":{'shop.items' :newItem}},)
                //             .then((docs)=>{
                //               console.log("Updated Docs : ", docs);
                //             })
                //             .catch((err)=>{
                //               console.log(err)
                //             })

                //             return {successMessage: "Saved Successfully"};
                //     }
                //   })

                // books.push(book);
                // return book;
            }
        },
        editItem: {
            type: successType,
            args: {
                UserId: { type: GraphQLID },
                ItemId: { type: GraphQLID },
                Name: { type: GraphQLString },
                Description: { type: GraphQLString },
                Price: { type: GraphQLInt },
                Quantity: { type: GraphQLString },
            },
            async resolve(parent, args) {
                await Item.updateOne({ _id: args.ItemId }, { "itemName": args.Name, "itemDescription": args.Description, "price": args.Price, "quantity": args.Quantity })
                    .then((item) => {
                        console.log("Edit successful");
                    })
                    .catch((err) => {
                        console.log("Edit failed " + err);
                    })
                await User.updateOne({ _id: args.UserId, 'shop.items.itemId': args.ItemId }, { 'shop.items.$.price': args.Price, 'shop.items.$.itemName': args.Name, 'shop.items.$.itemDescription': args.Description, 'shop.items.$.quantity': args.Quantity })
                    .then((item) => {
                        console.log("Edit successful");
                    })
                    .catch((err) => {
                        console.log("Edit failed " + err);
                    })
                return { successMessage: "Saved Successfully" };
            }
        },
        saveOrder: {
            type: successType,
            args: {
                UserId: { type: GraphQLID },
                Items: { type: new GraphQLList(ItemInputType) },
            },
            async resolve(parent, args) {
                let orderObj = { "orderDate": Date.now(), "items": args.Items }
                await User.updateOne({ _id: args.UserId },
                    { "$push": { 'orders': orderObj } })
                    .then((docs) => {
                        console.log("Updated Docs : ", docs);
                    })
                    .catch((err) => {
                        console.log(err)
                    })

                return { successMessage: "Saved Successfully" };
            }
        },
        saveFavItem: {
            type: successType,
            args: {
                UserId: { type: GraphQLID },
                Item: { type: ItemInputType },
                IsFavorite: { type: GraphQLBoolean }
            },
            async resolve(parent, args) {
                await User.updateOne({ _id: args.UserId }, { "$push": { 'favorite': args.Item } })
                    .then((item) => {
                        console.log("Updated successfully");
                    })
                    .catch((err) => {
                        console.log("Updation Failed");
                    })
                
                return { successMessage: "Saved Successfully" };
            }
        },
        removeFavItem: {
            type: successType,
            args: {
                UserId: { type: GraphQLID },
                ItemId: { type: GraphQLID },
                IsFavorite: { type: GraphQLBoolean }
            },
            async resolve(parent, args) {
                await User.updateOne({_id: args.UserId},{"$pull":{'favorite' :{_id:args.ItemId}}})
                .then((item)=>{
                  console.log("Deleted successfully");
                })
                .catch((err)=>{
                  console.log("Deletion Failed");
                })
                
                return { successMessage: "Saved Successfully" };
            }
        },
       saveShop: {
        type: successType,
        args: {
            userId: { type: GraphQLID },
            shopName: {type: GraphQLString}
        },
        async resolve(parent, args) {
            User.updateOne({_id:args.userId}, 
                {'shop.shopName' :args.shopName}, function (err, docs) {
                if (err){
                    console.log(err)
                }
                else{
                    console.log("Updated Docs : ", docs);
                }
            });
            
            return { successMessage: "Saved Successfully" };
        }
    },
    saveUser: {
        type: successType,
        args: {
            UserId: { type: GraphQLID },
            Gender: {type: GraphQLString},
            Country: {type: GraphQLString},
            City: {type: GraphQLString},
            BirthdayMonth: {type: GraphQLString},
            BirthdayYear: {type: GraphQLString},
            About: {type: GraphQLString}
        },
        async resolve(parent, args) {
            await User.updateOne({_id:args.UserId},{'gender':args.Gender,'country':args.Country,'city':args.City,'birthdayMonth':args.BirthdayMonth,'birthdayYear':args.BirthdayYear,'about':args.About})
            .then((user)=>{
              console.log("Updated successfully")
            })
            .catch((err)=>{
              console.log("Updation unsuccessfull "+err)
            })
            
            return { successMessage: "Saved Successfully" };
        }
    },
    signup: {
        type: successType,
        args: {
            firstName: { type: GraphQLString },
            email: { type: GraphQLString },
            encry_password: { type: GraphQLString }
        },
        async resolve(parent, args) {
            const user = new User(args);
            user.save((err, user)=>{
                 if(err){
                     console.log(err);
                     return { successMessage: "err" };
                 }
            });

            return { successMessage: "Saved Successfully" };
        }
    }
    }
});

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});

module.exports = schema;