const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const OrdersController = require("../controllers/orders");

// generic order routes. "/orders"
router.get("/", checkAuth, OrdersController.get_all_orders);

router.post("/", checkAuth, OrdersController.create_order);

// order-id specific routes. "/orders/{order_id}"
router.get("/:orderID", checkAuth, OrdersController.get_order);

router.delete("/:orderID", checkAuth, OrdersController.delete_order);

module.exports = router;