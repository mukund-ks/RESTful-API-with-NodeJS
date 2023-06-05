const express = require("express");
const router = express.Router();

// generic order routes. "/orders"
router.get("/", (req, res, next) => {
    res.status(200).json({
        message: "Orders fetched."
    });
});

router.post("/", (req, res, next) => {
    const order = {
        productID: req.body.productID,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message: "Orders created.",
        order: order
    });
});

// order-id specific routes. "/orders/{order_id}"
router.get("/:orderID", (req, res, next) => {
    res.status(200).json({
        message: "Order details",
        orderID: req.params.orderID,
    });
});

router.delete("/:orderID", (req, res, next) => {
    res.status(200).json({
        message: "Order deleted",
        orderID: req.params.orderID
    });
});

module.exports = router;