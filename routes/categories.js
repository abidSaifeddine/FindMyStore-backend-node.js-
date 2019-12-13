const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('./auth');
const Users = mongoose.model('Users');
const Wishlist = mongoose.model('wishLists');
const UserPref = mongoose.model('UserPreferences');
const Product = mongoose.model('Products');
const Category = mongoose.model('Categories');

router.get('/', auth.required ,(req,res) => {
    const { payload: { id } } = req;

    Category.find()
        .then(docs => { res.status(200).json(docs) })
});

router.post('/', auth.required ,(req,res) => {
    const { payload: { id } } = req;
    const { body : { category }} = req;

    var entry = new Category(category);
    entry.save().then(
        doc => {
            res.status(200).json(doc);
        }
    ).catch(err => res.status(400).json(err))
});

router.post('/types', auth.required ,(req,res) => {
    const { payload: { id } } = req;
    const { body : { category }} = req;
    const { body : { type }} = req;

    Category.findOne({_id: category})
        .then( item => {
            item.types.push(type);
            item.save().then(
                doc =>
                {
                    res.status(200).json(doc);
                }
            );
        }).catch( err => { res.status(400).json(err) })
});

module.exports = router;