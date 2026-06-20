const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  createBooking,
  getBookings,
  confirmBooking,
  cancelBooking,
} = require("../controllers/bookingController");

router.post("/", auth, createBooking);
router.get("/", auth, getBookings);

router.put("/:id/confirm", auth, confirmBooking);
router.put("/:id/cancel", auth, cancelBooking);

module.exports = router;