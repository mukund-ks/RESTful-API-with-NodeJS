const express = require("express");
const app = express();
const logger = require('morgan');

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");

//middlewares - in order.
app.use(logger('dev'));

app.use("/products", productRoutes);

app.use("/orders", orderRoutes);

app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: {
            message: err.message
        }
    });
});

module.exports = app;