const mongoose = require("mongoose");

const { Schema } = mongoose;

const ShopsSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: String,
    rate: Number,
    address: String,
    city: {
        type: String,
        required: true
    },
    owner: {
        type : Schema.ObjectId,
        ref : 'Users',
        required: true
    },
    products : [
        {
            type: Schema.ObjectId,
            ref : 'Products'
        }
    ],
    followers : [
        {
            type: Schema.ObjectId,
            ref: 'Users'
        }
    ],
    facebook : String,
    twitter : String,
    instagram : String
});

ShopsSchema.pre('save',function(next){
   next();
});


module.exports = mongoose.model('Shops', ShopsSchema);
