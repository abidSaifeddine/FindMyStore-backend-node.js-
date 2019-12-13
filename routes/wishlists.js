const mongoose = require('mongoose');

var router = require('express').Router();
var shops = mongoose.model('Shops');
var Product = mongoose.model('Products');
var User = mongoose.model('Users');
var Wishlist = mongoose.model('wishLists');
var UserPref = mongoose.model('UserPreferences');
const auth = require('./auth');

router.get('/', (req,res) =>{
    Wishlist.find().then(
        (data) => { res.status(200).json(data)}
    )
});
router.get('/current', auth.required, (req, res, next) => {
    const { payload: { id } } = req;

    return Wishlist.findOne({ user: id })
        .populate(
            [
                {
                    path: 'products',
                    model: 'Products'
                },
                {
                    path: 'stores',
                    model: 'Shops'
                }
            ]
        )
        .then((wishlist) => {
            if(!wishlist) {
                return res.sendStatus(400);
            }
            return res.json({ wishlist: wishlist});

        });
});

router.post('/products/add', auth.required, (req, res) =>{
    var { body : {product}} = req;
    const { payload: { id } } = req;
    Wishlist.findOne({ user: id })
        .then((wishlist) => {
            if(!wishlist)
                return res.sendStatus(400);

            wishlist.products.push(product._id);
            wishlist.save().then((data) => {
                UserPref.findOne({ user : id})//.populate({ path :'categories.item', model:'Categories'})
                    .then(
                        pref =>{

                            let color = pref.colors.find(item => item.name === product.color);
                            if(color)
                            {
                                color.score++;
                            }
                            else {
                                pref.colors.push({ name :product.color, score : 1});
                            }
                            let category = pref.categories.find(category => category.name === product.category.name);
                            if(category)
                            {
                                category.score++;
                            }
                            else {
                                pref.categories.push({ name : product.category.name, id : product.category._id, score : 1});
                            }
                            /*let brand = pref.brands.find(item => item.id === product.brand);

                            if(brand)
                            {
                                brand.score++;
                            }
                            else {
                                pref.brands.push({ id :product.brand, score : 1});
                            }*/

                            pref.save().then(
                                updatedPref => {
                                    Wishlist.populate(data, { path :'products', model:'Products'})
                                        .then((doc)=>{
                                            Product.findOne({ _id : product._id})
                                                .then(p =>{
                                                    p.score++
                                                    p.save().then(
                                                        updatedProduct =>
                                                        {
                                                            return res.status(200).json({wishlist : doc, userPref : updatedPref, updated : updatedProduct});
                                                        }
                                                    )
                                                })

                                        });
                                }
                            )
                        }
                    )
            }).catch(err => res.status(200).json({ error: err}))
        }).catch(err => res.status(400).json({ error: err}))
});

router.delete('/products/remove', auth.required, (req, res) =>{
    var { body : {product}} = req;
    const { payload: { id } } = req;

    Wishlist.findOne({ user: id })
        .then((wishlist) => {
            if(!wishlist)
                return res.sendStatus(400);

            wishlist.products.pull(product);
            wishlist.save().then((data) => {
                Wishlist.populate(data, { path :'products', model:'Products'})
                    .then((doc)=>{
                        return res.status(200).json({wishlist : doc});

                    })
            }).catch(err => res.status(200).json({ error: err}))
        })
});
module.exports = router;