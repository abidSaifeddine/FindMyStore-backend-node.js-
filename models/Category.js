const mongoose = require("mongoose");

const { Schema } = mongoose;

const TypesSchema = new Schema({

});

const CategoriesSchema = new Schema({
    name : String,
    types : [
        {
            name : String
        }
    ]
});

module.exports = mongoose.model('Categories', CategoriesSchema);
