const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");

// generic order routes. "/orders"
router.get("/", (req, res, next) => {
    Order.find()
        .select("product quantity _id")
        .populate("product","name price _id")
        .exec()
        .then(doc => {
            if (doc.length == 0) {
                res.status(404).json({ message: "No Order entries in Database" });
            } else {
                const response = {
                    count: doc.length,
                    orders: doc.map(d => {
                        return {
                            _id: d._id,
                            product: d.product,
                            quantity: d.quantity,
                            request: {
                                type: "GET",
                                description: "DETAILED_ORDER_VIEW",
                                url: `http://localhost:3000/orders/${d._id}`
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
        })
});

router.post("/", (req, res, next) => {
    Product.findById(req.body.productID).exec()
        .then(product => {
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productID
            });
            return order.save();
        })
        .then(result => {
            res.status(201).json({
                message: "Order created",
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: "GET",
                    description: "DETAILED_ORDER_VIEW",
                    url: `http://localhost:3000/orders/${result._id}`
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
});

// order-id specific routes. "/orders/{order_id}"
router.get("/:orderID", (req, res, next) => {
    const id = req.params.orderID;
    Order.findById(id)
        .select("_id product quantity")
        .populate("product","name price _id")
        .exec()
        .then(order => {
            if (order) {
                res.status(200).json({
                    order: order,
                    request: {
                        type: "GET",
                        description: "GET_ALL_ORDERS",
                        url: "http://localhost:3000/orders/"
                    }
                })
            } else {
                res.status(404).json({ message: "No valid order(s) for provided ID" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
});

router.delete("/:orderID", (req, res, next) => {
    const id = req.params.orderID;
    Order.deleteOne({ _id: id })
        .exec()
        .then(() => {
            res.status(200).json({
                message: "Order deleted",
                request: {
                    type: "POST",
                    description: "CREATE_NEW_ORDER",
                    url: "http://localhost:3000/orders/",
                    body: { productID: "ID", quantity: "Number" }
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
});

module.exports = router;