const   express                     = require('express'),
        adminController             = require("../controller/adminController");

const router = express.Router();

// DASHBOARD
router.get("/", adminController.index);

// EXPORTING THE ROUTER
module.exports = router;
