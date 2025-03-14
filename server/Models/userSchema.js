var mongoose = require("mongoose");
const crypto = require('crypto');
const { v1: uuidv1 } = require("uuid");
var Item = require("./itemSchema")
var userSchema = new mongoose.Schema(
    {
      firstName: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
      },
      lastName: {
        type: String,
        maxlength: 32,
        trim: true
      },
       email: {
        type: String,
        trim: true,
        required: true,
        unique: true
      },
      encry_password: {
        type: String,
        required: true
      },
      salt: String,
      gender:{
        type: String
      },
      imagePath:{
        type: String
      },
      country:{
        type: String
      },
      city:{
        type: String
      },
      birthdayMonth:{
        type: String
      },
      birthdayYear:{
        type: String
      },
      about:{
        type: String
      },
      shop: {
          shopName: {
              type: String,
              unique: false,
              sparse:true
          },
          shopImageUrl: {
            type: String,
            trim: true,
            default:"",
            unique: false,
            sparse:true
          },
          items: {
            default: [],
            type: [
              {
                itemId:{
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'Item'
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
            ]
            
        }
      },
      orders:{
        default: [],
        type:[
          {
            orderDate: {
              type: Date,
              default: Date.now
            },
            items: {
              default: [],
              type: [
                {
                  itemId:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Item'
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
                  },
                  isGift: {
                    type: Boolean,
                    default: false
                  },
                  note: {
                    type: String,
                    maxlength: 300
                  }
                }
              ]
              
          }
          }
        ]
      },
      favorite:{
        default: [],
        type: [
          {
            itemId:{
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Item'
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
        ]
      }
    }
)

userSchema.virtual('fullName').
  get(function() {
    return this.firstName + ' ' + this.lastName;
   }).
  set(function(v) {
    this.firstName = v.substr(0, v.indexOf(' '));
    this.lastName = v.substr(v.indexOf(' ') + 1);
  });

  userSchema.virtual('password').
  set(function(password){
    this._password=password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password)
  })
  .get(function(){
    return this._password;
  })
userSchema.methods = {
  securePassword: function(plainpassword){
    if(plainpassword=="")
      return "";
    try {
      const secret = this.salt;
      return crypto.createHmac('sha256', secret)
                   .update(plainpassword)
                   .digest('hex');
    } catch (error) {
      return "";
    }
  },
  // authenticate: function(plainpassword){
  //     return this.securePassword(plainpassword)===this.encry_password;
  // }
  authenticate: function(plainpassword){
    return plainpassword===this.encry_password;
}
}

module.exports = mongoose.model("User",userSchema);