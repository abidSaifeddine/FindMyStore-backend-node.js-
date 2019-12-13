const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserPreferencesSchema = new Schema({
    user : {
        type: Schema.ObjectId,
        ref :'Users',
        unique:true
    }
    ,
    brands : [
        {
            id : {
                type: Schema.ObjectId,
                ref :'Brands',
                unique: true
            },
            score : Number
        }
    ],
    colors :[
        {
            name: {
                type: String
            },
            score : Number
        }
    ],
    categories : [
        {
            id : {
                type : Schema.ObjectId
            },
            name : {
                type: String
            },
            score : Number
        }
    ]
});

module.exports =  mongoose.model('UserPreferences', UserPreferencesSchema);