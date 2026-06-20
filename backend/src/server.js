const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Static Images
app.use(
  "/images",
  express.static(path.join(__dirname, "public/images"))
);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => {
  res.send("Travel Destination API");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});