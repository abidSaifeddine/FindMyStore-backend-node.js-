const mongoose = require("mongoose");

const { Schema } = mongoose;

const WishListsSchema = new Schema({
   user: {
       type: Schema.ObjectId,
       ref: 'Users'
   },
    categories : [{
       type: Schema.ObjectId,
        ref: 'Categories'
    }],
    products : [
        {
            type: Schema.ObjectId,
            ref: 'Products'
        }
    ],
    stores : [
        {
            type: Schema.ObjectId,
            ref: 'Shops'
        }
    ]

});

module.exports = mongoose.model('wishLists',WishListsSchema);