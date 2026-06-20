const express = require("express");

const router = express.Router();

const auth =
require("../middleware/authMiddleware");

const validateDestination =
require("../middleware/validateDestination");

const {
getAll,
getById,
create,
update,
remove
}
=

require("../controllers/destinationController");

router.get("/", getAll);

router.get("/:id", getById);

router.post(
"/",
auth,
validateDestination,
create
);

router.put("/:id", auth, update);

router.delete("/:id", auth, remove);

module.exports = router;
