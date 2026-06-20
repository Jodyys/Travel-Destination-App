const express = require("express");

const router = express.Router();

const auth =
require("../middleware/authMiddleware");

const {
 addFavorite,
 getFavorites,
 deleteFavorite
}
=
require("../controllers/favoriteController");

router.get(
 "/",
 auth,
 getFavorites
);

router.post(
 "/",
 auth,
 addFavorite
);

router.delete(
 "/:id",
 auth,
 deleteFavorite
);

module.exports = router;