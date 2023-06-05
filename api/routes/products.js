const express = require("express");
const router = express.Router();

// generic product routes. "/products"
router.get("/", (req, res, next) => {
    res.status(200).json({
        message: "GET requests to /products"
    });
});

router.post("/", (req, res, next) => {
    const product = {
        name: req.body.name,
        price: req.body.price
    };
    res.status(201).json({
        message: "POST requests to /products",
        createdProduct: product
    });
});

// product id specific routes. "/products/{product_id}"
router.get("/:productID", (req, res, next) => {
    const id = req.params.productID;
    if (id == "69") {
        res.status(200).json({
            message: "Special ID!",
            id: id
        });
    } else {
        res.status(200).json({
            message: "Regular ID",
            id: id
        });
    }
});

router.patch("/:productID", (req, res, next) => {
    const id = req.params.productID;
    res.status(200).json({
        message: `Product with id as ${id} is updated!`
    });
});

router.delete("/:productID", (req, res, next) => {
    const id = req.params.productID;
    res.status(200).json({
        message: `Product with id as ${id} is deleted!`
    });
});

module.exports = router;