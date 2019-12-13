const mongoose = require("mongoose");

const { Schema } = mongoose;

const ProductsSchema = new Schema({
    name: String,
    image: String,
    ref: Number,
    color: String,
    shop : {
        type : Schema.ObjectId,
        ref : 'Shops',
        required : true
    },
    category : {
        type : Schema.ObjectId,
        ref: 'Categories',
        required: true
    },
    type : String,
    brand : {
        type : Schema.ObjectId,
        ref: 'Brands'
    },
    score : Number
});

module.exports = mongoose.model('Products', ProductsSchema);
