const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const mongoose = require("mongoose");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(new Error("Unsupported File Type"), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});

// generic product routes. "/products"
router.get("/", (req, res, next) => {
    Product.find()
        .select("name price _id productImage")
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
                            productImage: d.productImage,
                            request: {
                                type: "GET",
                                description: "DETAILED_PRODUCT_VIEW",
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

router.post("/", checkAuth, upload.single("productImage"), (req, res, next) => {
    console.log(req.file);
    console.log(req.body);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save() // Not using "exec()" here because save() gives a real promise.
        .then(result => {
            res.status(201).json({
                message: "Product created successfully",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    productImage: result.productImage,
                    request: {
                        type: "GET",
                        description: "VIEW_CREATED_PRODUCT",
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
        .select("name price _id productImage")
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

router.patch("/:productID", checkAuth, (req, res, next) => {
    const id = req.params.productID;
    Product.findByIdAndUpdate(id, { $set: req.body }, { new: true })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product Updated",
                updatedProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    productImage: result.productImage
                },
                request: {
                    type: "GET",
                    description: "VIEW_UPDATED_PRODUCT",
                    url: `http://localhost:3000/products/${result._id}`
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.delete("/:productID", checkAuth, (req, res, next) => {
    const id = req.params.productID;
    Product.findOneAndDelete({ _id: id })
        .exec()
        .then(() => {
            res.status(200).json({
                message: "Product Deleted",
                request: {
                    type: "POST",
                    description: "CREATE_NEW_PRODUCT",
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