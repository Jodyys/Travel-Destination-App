const bookingModel = require("../models/bookingModel");

/**
 * Membuat Booking Baru
 */
const createBooking = async (req, res) => {
  try {
    const { destination_id, booking_date, total_person } = req.body;

    // Validasi input sederhana sebelum masuk ke database
    if (!destination_id || !booking_date || !total_person) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (parseInt(total_person, 10) < 1) {
      return res.status(400).json({ message: "Total person must be at least 1" });
    }

    const booking = await bookingModel.createBooking(
      req.user.id, // Diambil dari middleware auth token
      destination_id,
      booking_date,
      parseInt(total_person, 10)
    );

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Mengambil Semua Daftar Booking Milik User yang Sedang Login
 */
const getBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.getBookingsByUser(req.user.id);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Mengonfirmasi Status Booking (Confirmed)
 */
const confirmBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await bookingModel.updateStatus(id, "confirmed");

    res.json({ message: "Booking confirmed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Membatalkan Status Booking (Cancelled)
 */
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await bookingModel.updateStatus(id, "cancelled");

    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// FIX: Gabungkan semua fungsi ke dalam SATU module.exports saja di paling bawah
module.exports = {
  createBooking,
  getBookings,
  confirmBooking,
  cancelBooking,
};