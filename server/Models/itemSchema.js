var mongoose = require("mongoose");

var itemSchema = new mongoose.Schema(
    {
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        categoryName:{
            type: String
        },
        itemName: {
            type: String
        },
        itemDescription: {
          type: String,
          maxlength: 300
        },
        price: {
          type: Number,
          default: 0,
          required: true
        },
        quantity: {
          type: Number,
          default: 0,
          required: true
        },
        isFavorite: {
            type: Boolean,
            default: false,
        },
        salesCount: {
            type: Number,
            default: 0
        },
        itemImageUrl: {
            type: String
        }
    }
)

module.exports = mongoose.model("Item",itemSchema);