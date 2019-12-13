const mongoose = require('mongoose');

var router = require('express').Router();
var shops = mongoose.model('Shops');
var Product = mongoose.model('Products');
var User = mongoose.model('Users');
const jwt = require('jsonwebtoken');
const auth = require('./auth');

//All enteries of shops
router.get('/',(req,res)=>{
    shops.find().exec().then(data=>{
        res.json({
            shops: data
        });
    }).catch(err=>console.log(err));

});

router.get('/find/:name',(req,res)=>{
    shops.findOne({name:req.params.name}).populate('products')
        .then(doc => {
            shops.populate(doc, {path :'products.category',model:'Categories'}).then(
                result => {
                    res.status(200).json({ shop : result});

                }
            )
        })
        .catch(err => res.status(400).json({ error : err}));
});

// Add new shop
router.post('/', auth.required ,(req,res)=>{
    var { body: {shop} } = req;
    var { payload: { id }} = req;
    var bodyData = new shops(shop);

    User.findById(id)
        .then((user) => {
            if(user)
            {
                bodyData.owner = user._id;
                bodyData.save().then(data=>{
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

router.get('/user', auth.required, (req,res) => {
    const { payload: { id } } = req;

    User.findById(id)
        .then((user) => {
            if(!user)
                return res.json({ error : 'user not found'});
            else
            {
                shops.find(
                    {
                        owner : user._id
                    }
                ).populate('products').then( data => {
                    res.status(200).json(data);
                })
        }
        })
});


// All products
router.get('/products', (req, res) => {
    Product.find().exec().then( data => {
        res.send(data)
    }).catch( err => {
        res.status(500).json({
            error : err
        })
    })
});

// PRODUCTS BY SHOP
router.get('/:id/products', (req, res) => {
    /*var { id } = req.params;
    Product.find().exec().then( data => {
        res.send(data)
    }).catch( err => {
        res.status(500).json({
            error : err
        })
    })*/
});

router.get('/updateall', (req,res) =>{
    Product.find().then(
        docs => {
            docs.map((doc,index) => {
                doc.score = 1;
                doc.save();
            })
        }
    )
})
// Add new  product
router.post('/products', (req,res) => {
    var { body : {product}} = req;
    var product = new Product(product);

    product.save().then( data => {
        shops.findOne({_id:product.shop}, (err, doc) => {
            doc.products.push(data._id);
            doc.save();
        });
        res.status(200).json({
            created : data
        })
    })
        .catch(err => {
            res.status(500).json({
                error : err
            })
        })
});

router.patch('/', (req, res) => {
   var { body : { shop }}= req;
   var shop = new shops(shop);

   shops.findOneAndUpdate({'_id':shop._id}, shop, { upsert : true})
       .then( data => res.status(200).json({ message : "success", object : data})
           .catch(err => res.status(400).json({ error : err}))
        )
});

router.post('/updateadll', (req,res) =>{

});
module.exports = router;