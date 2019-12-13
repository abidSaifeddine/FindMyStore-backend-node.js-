const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('./auth');
const Users = mongoose.model('Users');
const Wishlist = mongoose.model('wishLists');
const UserPref = mongoose.model('UserPreferences');
const Product = mongoose.model('Products');

router.get('/products/bycolor', auth.required ,(req,res) => {
    const { payload: { id } } = req;
    UserPref.findOne({ user : id })
        .then(preferences => {
            let products = [];
            preferences.colors.sort((a, b) => (a.score < b.score) ? 1 : -1);
            preferences.colors.slice(0,5).map((color, index) => {
                //console.log(color);
                products.push(color.name);
            });
            Product.find({ color : { $in : products} },
                ['name','image','color','shop','category','brand','score'],{
                    limit : 10,
                    sort:{
                        score: -1 //Sort by Date Added ASC
                    }
                }).then((docs) =>{
                //res.status(200).json(docs)
                res.status(200).json(docs)
            })

            /*preferences.brands.slice(0,5).map((color, index) => {

            });*/
        })
});

router.get('/products/bycategory', auth.required ,(req,res) => {
    const { payload: { id } } = req;
    UserPref.findOne({ user : id })
        .then(preferences => {
            let products = [];
            preferences.categories.sort((a, b) => (a.score < b.score) ? 1 : -1);
            preferences.categories.slice(0,5).map((category, index) => {
                products.push(category.id);
            });
            Product.find({ category : { $in : products}  },
                ['name','image','color','shop','category','brand','score'],{
                    limit:10,
                    sort:{
                        score: -1 //Sort by Date Added ASC
                    }
                }).then((docs) =>{
                //console.log(docs);
                res.status(200).json(docs)
            })
            /*preferences.brands.slice(0,5).map((color, index) => {

            });*/
        })
});
module.exports = router;