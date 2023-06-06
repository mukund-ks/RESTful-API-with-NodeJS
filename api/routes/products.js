const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const mongoose = require("mongoose");

// generic product routes. "/products"
router.get("/", (req, res, next) => {
    Product.find()
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc.length == 0) {
                res.status(404).json({ message: "No entries in database" });
            } else {
                res.status(200).json(doc);
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
    product.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "POST Request to /products",
                createdProduct: result
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
        .exec()
        .then(doc => {
            console.log("From database:", doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: "No valid entry for provided ID" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.patch("/:productID", (req, res, next) => {
    const id = req.params.productID;
    Product.findByIdAndUpdate(id, { $set: req.body }, { new: true }).exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
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
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

module.exports = router;