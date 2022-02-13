const   express                     = require('express'),
        indexController             = require("../controller/indexController");

const router = express.Router();

// INDEX
router.get("/", indexController.index);

// ABOUT
router.get("/about", indexController.about);

// SERVICES
router.get("/services", indexController.services);

// CONTACT
router.get("/contact", indexController.contact);

// APPLY
router.get("/apply", indexController.apply);

// LOGIN
router.get("/login", indexController.login);

// EXPORTING THE ROUTER
module.exports = router;
