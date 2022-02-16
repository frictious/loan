const   express                     = require('express'),
        indexController             = require("../controller/indexController");

const router = express.Router();

//Login checker
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.role === "Customer"){
            return next();
        }else{
            res.redirect("/logout");
        }
    }else{
        res.redirect("/login");
    }
};

// INDEX
router.get("/", indexController.index);

// ABOUT
router.get("/about", indexController.about);

// SERVICES
router.get("/services", indexController.services);

// CONTACT
router.get("/contact", indexController.contact);

// CONTACT FORM LOGIC
router.post("/contact", indexController.contactLogic);

// APPLY
router.get("/apply", isLoggedIn, indexController.apply);

// APPLY LOGIC
router.post("/request", indexController.request);

// LOGIN
router.get("/login", indexController.login);

// LOGIN LOGIC
router.post("/login", indexController.loginLogic);

// LOGOUT LOGIC
router.get("/logout", indexController.logout);

// CUSTOMER SETPASSWORD
router.get("/setpassword/:id", indexController.setpassword);

// CUSTOMER SETPASSWORD LOGIC
router.post("/setpassword/:id", indexController.setpasswordLogic);

// EXPORTING THE ROUTER
module.exports = router;
