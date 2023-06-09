const express = require("express");
const app = express();
const logger = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");

// Connecting to DB
mongoose.connect(
    "mongodb+srv://mukundKS:"+process.env.MONGO_ATLAS_PASS+"@cluster0.c9zrqw0.mongodb.net/?retryWrites=true&w=majority"
);

// Middlewares - in order.
app.use(logger('dev'));

app.use("/uploads",express.static("uploads"))

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// Preventing CORS Errors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
        return res.status(200).json({});
    }
    next();
});

app.use("/products", productRoutes);

app.use("/orders", orderRoutes);

app.use("/user", userRoutes);

// Error Handling
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