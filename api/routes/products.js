const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");
const ProductsController = require("../controllers/products");

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
router.get("/", ProductsController.get_all_products);

router.post("/", checkAuth, upload.single("productImage"), ProductsController.create_product);

// product id specific routes. "/products/{product_id}"
router.get("/:productID", ProductsController.get_product);

router.patch("/:productID", checkAuth, ProductsController.update_product);

router.delete("/:productID", checkAuth, ProductsController.delete_product);

module.exports = router;