const mongoose = require("mongoose");

const { Schema } = mongoose;

const SubCategoriesSchema = new Schema({

});

module.exports = mongoose.model('SubCategories', SubCategoriesSchema);
