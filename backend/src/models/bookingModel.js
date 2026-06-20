const pool = require("../config/db");

/**
 * Membuat data reservasi baru (Booking)
 */
const createBooking = async (userId, destinationId, bookingDate, totalPerson) => {
  // Membuat kode booking unik dengan prefix 'TRV-' + 6 digit terakhir timestamp
  const bookingCode = `TRV-${Date.now().toString().slice(-6)}`;

  const queryText = `
    INSERT INTO bookings (
      booking_code, 
      user_id, 
      destination_id, 
      booking_date, 
      total_person
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const values = [bookingCode, userId, destinationId, bookingDate, totalPerson];

  try {
    const result = await pool.query(queryText, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error in createBooking model:", error.message);
    throw error;
  }
};

/**
 * Mengambil semua data reservasi berdasarkan ID Pengguna
 */
const getBookingsByUser = async (userId) => {
  const queryText = `
    SELECT
      b.id,
      b.booking_code,
      d.title,
      d.location,
      d.image_url,
      d.price,
      (d.price * b.total_person) AS total_price,
      b.booking_date,
      b.total_person,
      b.status
    FROM bookings b
    JOIN destinations d ON d.id = b.destination_id
    WHERE b.user_id = $1
    ORDER BY b.id DESC;
  `;

  try {
    const result = await pool.query(queryText, [userId]);
    return result.rows;
  } catch (error) {
    console.error("Error in getBookingsByUser model:", error.message);
    throw error;
  }
};

/**
 * Memperbarui status booking (confirmed / cancelled)
 */
const updateStatus = async (bookingId, status) => {
  const queryText = `
    UPDATE bookings
    SET status = $1
    WHERE id = $2
    RETURNING *;
  `;

  try {
    const result = await pool.query(queryText, [status, bookingId]);
    return result.rows[0]; // Mengembalikan data yang diupdate (opsional, tapi berguna)
  } catch (error) {
    console.error("Error in updateStatus model:", error.message);
    throw error;
  }
};

// FIX: Cukup satu module.exports saja di paling bawah file agar tidak saling menimpa
module.exports = {
  createBooking,
  getBookingsByUser,
  updateStatus,
};