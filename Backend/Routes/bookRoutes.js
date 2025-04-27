const express = require("express"); // ✅ You forgot this line
const router = express.Router();    // ✅ Now this works

const bookcontroller = require("../controllers/bookController");

// Routes
router.get("/", bookcontroller.getAllbooks);
router.post("/",bookcontroller.createBook);

module.exports = router; // ✅ Export the router properly
