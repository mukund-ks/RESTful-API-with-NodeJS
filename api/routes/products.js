const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const mongoose = require("mongoose");
const product = require("../models/product");

// generic product routes. "/products"
router.get("/", (req, res, next) => {
    Product.find()
        .select("name price _id")
        .exec()
        .then(doc => {
            if (doc.length == 0) {
                res.status(404).json({ message: "No Product entries in Database" });
            } else {
                const response = {
                    count: doc.length,
                    products: doc.map(d => {
                        return {
                            name: d.name,
                            price: d.price,
                            _id: d._id,
                            request: {
                                type: "GET",
                                url: `http://localhost:3000/products/${d._id}`
                            }
                        };
                    })
                };
                res.status(200).json(response);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.post("/", (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save() // Not using "exec()" here because save() gives a real promise.
        .then(result => {
            res.status(201).json({
                message: "Product created successfully",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: "GET",
                        url: `http://localhost:3000/products/${result._id}`
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

// product id specific routes. "/products/{product_id}"
router.get("/:productID", (req, res, next) => {
    const id = req.params.productID;
    Product.findById(id)
        .select("name price _id")
        .exec()
        .then(product => {
            // console.log("From database:", doc);
            if (product) {
                res.status(200).json({
                    product: product,
                    request: {
                        type: "GET",
                        description: "GET_ALL_PRODUCTS",
                        url: `http://localhost:3000/products/`
                    }
                });
            } else {
                res.status(404).json({ message: "No valid product for provided ID" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.patch("/:productID", (req, res, next) => {
    const id = req.params.productID;
    Product.findByIdAndUpdate(id, { $set: req.body }, { new: true })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product Updated",
                updatedProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id
                },
                request: {
                    type: "GET",
                    url: `http://localhost:3000/products/${result._id}`
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.delete("/:productID", (req, res, next) => {
    const id = req.params.productID;
    Product.deleteOne({ _id: id })
        .exec()
        .then(() => {
            res.status(200).json({
                message: "Product Deleted",
                request: {
                    type: "POST",
                    description: "Create a new Product",
                    url: "http://localhost:3000/products",
                    body: { name: "String", price: "Number" }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

module.exports = router;