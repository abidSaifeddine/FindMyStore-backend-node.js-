const mongoose = require("mongoose");

const { Schema } = mongoose;

const BrandSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    field : String
});

module.exports =  mongoose.model('Brands', BrandSchema);