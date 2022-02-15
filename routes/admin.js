const   express                     = require('express'),
        adminController             = require("../controller/admin/adminController"),
        customerController          = require("../controller/admin/customerController"),
        loanController              = require("../controller/admin/loanController"),
        businessController          = require("../controller/admin/businessController"),
        passport                    = require("passport"),
        mongoose                    = require("mongoose"),
        bcrypt                      = require("bcryptjs"),
        crypto                      = require("crypto"),
        path                        = require("path"),
        multer                      = require("multer"),
        {GridFsStorage}             = require("multer-gridfs-storage"),
        Grid                        = require("gridfs-stream"),
        nodemailer                  = require("nodemailer");

const router = express.Router();

require("dotenv").config();
//CONFIG

//GRIDFS File db connection
const URI = process.env.MONGOOSE;
const conn = mongoose.createConnection(URI, {
    useNewUrlParser : true,
    useUnifiedTopology : true
});

//GRIDFS CONFIG FOR IMAGES
let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("files");
});

//GRIDFS STORAGE CONFIG
const storage = new GridFsStorage({
    url: URI,
    options : {useUnifiedTopology : true},
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
            if (err) {
                return reject(err);
            }
            const filename = buf.toString('hex') + path.extname(file.originalname);
            const fileInfo = {
                filename: filename,
                bucketName: "files"
            };
            resolve(fileInfo);
            });
        });
    }
});

//Multer config for images
const files = multer({ storage });

//Uploading multiple house images
const cpUpload = files.fields([{ name: 'front', maxCount: 1 }, { name: 'back', maxCount: 1 },
{name : 'inside', maxCount : 1}, {name : 'outside', maxCount : 1}]);

// DASHBOARD
router.get("/", adminController.index);

// ====================================================================================
// CUSTOMERS
router.get("/customers", customerController.customers);

// ADD CUSTOMER
router.get("/customer/add", customerController.addCustomer);

// ADD CUSTOMER LOGIC
router.post("/customer/add", files.single("picture"), customerController.addCustomerLogic);

// EDIT CUSTOMER FORM
router.get("/customer/edit/:id", customerController.editcustomer);

// UPDATE CUSTOMER FORM
router.put("/customer/update/:id", customerController.editCustomerLogic);

// DELETE CUSTOMER
router.delete("/customer/:id", customerController.deleteCustomer);

// END OF CUSTOMERS SECTION
// ====================================================================================

// ====================================================================================
// REQUESTS
router.get("/requests", loanController.requests);

// DELETE REQUEST
router.delete("/request/:id", loanController.deleteRequest);

// VIEW ALL LOANS
router.get("/loans", loanController.loans);

// ADD LOAN FORM
router.get("/loan/add", loanController.addLoan);

// ADD LOAN FORM LOGIC
router.post("/loan/add", loanController.addLoanLogic);

// EDIT LOAN FORM
router.get("/loan/edit/:id", loanController.editloan);

// EDIT LOAN FORM LOGIC
router.put("/loan/edit/:id", loanController.editLoanLogic);

// DELETE LOAN LOGIC
router.delete("loan/:id", loanController.deleteLoan);

// ====================================================================================
// USERS
// GET ALL USERS
router.get("/users", adminController.users);

// ADD USER FORM
router.get("/user/add", adminController.adduser);

// ADD USER FORM LOGIC
router.post("/user/add", adminController.adduserLogic);

// USER PROFILE FORM
router.get("/profile/:id", adminController.edituser);

// USER PROFILE FORM LOGIC
router.put("/profile/:id", adminController.edituserLogic);

// DELETE USER
router.delete("/user/:id", adminController.deleteUser);

// LOGIN FORM
router.get("/login", adminController.login);

// LOGIN FORM LOGIC
router.post("/login", adminController.loginLogic);

// =========================================================================================
// BUSINESS SECTION
// ADD BUSINESS INFORMATION FORM
router.get("/business/add/:id", businessController.addBusinessInformation);

// ADD BUSINESS INFORMATION FORM LOGIC
router.post("/business/add/:id", businessController.addBusinessInformationLogic);

// EDIT BUSINESS INFORMATION FORM
router.get("/business/edit/:id", businessController.editbusiness);

// EDIT BUSINESS INFORMATION FORM LOGIC
router.put("/business/edit/:id", businessController.editBusinessLogic);

// EXPORTING THE ROUTER
module.exports = router;
