const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/signup", (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({ message: "E-mail already in use" });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({ error: err });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(() => {
                                res.status(201).json({ message: "User Created" });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({ error: err });
                            });
                    }
                });
            }
        });
});

router.post("/login", (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({ message: "Authorization failed" });
            } else {
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err) {
                        return res.status(401).json({ message: "Authorization failed" });
                    }
                    if (result) {
                        const token = jwt.sign(
                            { email: user[0].email, userID: user[0]._id }, 
                            process.env.JWT_KEY,
                            { expiresIn: "1h" }
                        );
                        return res.status(200).json({
                            message: "Authorization successfull",
                            token: token,
                        });
                    }
                    res.status(401).json({ message: "Authorization failed" });
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.delete("/:userID", (req, res, next) => {
    User.deleteOne({ _id: req.params.userID })
        .exec()
        .then(() => {
            res.status(200).json({ message: "User Deleted" });
        })
        .catch(err => {
            res.status(500).json({ erorr: err });
        });
});

module.exports = router;