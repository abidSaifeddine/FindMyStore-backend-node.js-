const mongoose = require('mongoose');
var router = require('express').Router();
var shops = mongoose.model('Shops');
var Product = mongoose.model('Products');
var User = mongoose.model('Users');
const auth = require('./auth');


router.get('/', (req,res) => {
    Product.find().exec()
        .then(
            data => res.status(200).json(data)
        )
        .catch(err => res.status(400).json({ error : err}));
});

router.post('/', auth.required, (req,res) => {
    var { body : { product } } = req;
    var { payload : { id }} = req;
    var body = new Product(product);

    User.findById(id)
        .then((user) => {
            if(user)
            {
                body.save().then(data=>{
                    shops.findOneAndUpdate({ '_id' : body.shop }).then(shop => {
                        shop.products.push(data)
                        shop.save()
                    });
                    res.status(200).json(
                        {
                            message : "success",
                            object : data
                        }
                    )
                })
                    .catch(err => res.status(400).json({ error : err}));

            }
            else
            {
                return res.json({ error : 'user not found'})
            }
        })
});

module.exports = router;