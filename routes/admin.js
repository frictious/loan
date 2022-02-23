const   express                     = require('express'),
        adminController             = require("../controller/admin/adminController"),
        customerController          = require("../controller/admin/customerController"),
        loanController              = require("../controller/admin/loanController"),
        businessController          = require("../controller/admin/businessController"),
        assetController             = require("../controller/admin/assetController"),
        guarantorController         = require("../controller/admin/guarantorController"),
        passport                    = require("passport"),
        mongoose                    = require("mongoose"),
        crypto                      = require("crypto"),
        path                        = require("path"),
        multer                      = require("multer"),
        {GridFsStorage}             = require("multer-gridfs-storage"),
        Grid                        = require("gridfs-stream");

const router = express.Router();

require("dotenv").config();
//CONFIG

//Login checker
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.role === "Admin" || req.user.role === "Loan Officer"){
            return next();
        }else{
            res.redirect("/admin/logout");
        }
    }else{
        res.redirect("/admin/login");
    }
};

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
router.get("/", isLoggedIn, adminController.index);

// ====================================================================================
// CUSTOMERS
router.get("/customers", customerController.customers);

// ADD CUSTOMER
router.get("/customer/add", isLoggedIn, customerController.addCustomer);

// ADD CUSTOMER LOGIC
router.post("/customer/add", files.single("picture"), customerController.addCustomerLogic);

// VIEW CUSTOMER INFORMATION
router.get("/customer/:id", customerController.customer);

// EDIT CUSTOMER FORM
router.get("/customer/edit/:id", isLoggedIn, customerController.editcustomer);

// UPDATE CUSTOMER FORM
router.put("/customer/update/:id", files.single("picture"), customerController.editCustomerLogic);

// DELETE CUSTOMER
router.delete("/customer/:id", customerController.deleteCustomer);

// CUSTOMER PICTURE
router.get("/customer/picture/:filename", customerController.files);

// END OF CUSTOMERS SECTION
// ====================================================================================

// ====================================================================================
// LOAN SECTION
// REQUESTS
router.get("/requests", isLoggedIn, loanController.requests);

// APPROVE REQUEST FORM
router.get("/request/approve/:id", isLoggedIn, loanController.approverequest);

// APPROVE REQUEST FORM LOGIC
router.put("/request/approve/:id", loanController.approverequestLogic);

// REJECT REQUEST FORM
router.get("/request/reject/:id", isLoggedIn, loanController.rejectrequest);

// REJECT REQUEST FORM LOGIC
router.put("/request/reject/:id", loanController.rejectrequestLogic);

// DELETE REQUEST
router.delete("/request/:id", loanController.deleteRequest);

// VIEW ALL LOANS
router.get("/loans", isLoggedIn, loanController.loans);

// ADD LOAN FORM
router.get("/loan/add", isLoggedIn, loanController.addLoan);

// ADD LOAN FORM LOGIC
router.post("/loan/add", loanController.addLoanLogic);

// EDIT LOAN FORM
router.get("/loan/:id", isLoggedIn, loanController.editloan);

// EDIT LOAN FORM LOGIC
router.put("/loan/edit/:id", loanController.editLoanLogic);

// DELETE LOAN LOGIC
router.delete("/loan/:id", loanController.deleteLoan);

// ====================================================================================
// USERS
// GET ALL USERS
router.get("/users", isLoggedIn, adminController.users);

// ADD USER FORM
router.get("/user/add", isLoggedIn, adminController.adduser);

// ADD USER FORM LOGIC
router.post("/user/add", adminController.adduserLogic);

// USER PROFILE FORM
router.get("/profile/:id", isLoggedIn, adminController.edituser);

// USER PROFILE FORM LOGIC
router.put("/profile/:id", adminController.edituserLogic);

// DELETE USER
router.delete("/user/:id", adminController.deleteUser);

// LOGIN FORM
router.get("/login", adminController.login);

// LOGIN FORM LOGIC
router.post("/login", adminController.loginLogic);

// LOGOUT
router.get("/logout", adminController.logout);

// DELETE USER
router.delete("/:id", adminController.deleteUser);

// =========================================================================================
// BUSINESS SECTION
// ADD BUSINESS INFORMATION FORM
router.get("/business/add/:id", isLoggedIn, businessController.addBusinessInformation);

// ADD BUSINESS INFORMATION FORM LOGIC
router.post("/business/add", businessController.addBusinessInformationLogic);

// EDIT BUSINESS INFORMATION FORM
router.get("/business/edit/:id", isLoggedIn, businessController.editbusiness);

// EDIT BUSINESS INFORMATION FORM LOGIC
router.put("/business/edit/:id", businessController.editBusinessLogic);

// =========================================================================================
// ASSETS SECTION
// ADD ASSET INFORMATION FORM
router.get("/asset/add/:id", isLoggedIn, assetController.addAssetInformation);

// ADD ASSET INFORMATION FORM LOGIC
router.post("/asset/add", files.single("document"), assetController.addAssetInformationLogic);

// EDIT ASSET INFORMATION FORM
router.get("/asset/edit/:id", isLoggedIn, assetController.editAsset);

// EDIT ASSET INFORMATION FORM LOGIC
router.put("/asset/edit/:id", files.single("document"), assetController.editAssetLogic);

// =========================================================================================
// GUARANTORS SECTION
// ADD GUARANTORS INFORMATION FORM
router.get("/guarantor/add/:id", isLoggedIn, guarantorController.addGuarantorInformation);

// ADD GUARANTORS INFORMATION FORM LOGIC
router.post("/guarantor/add", files.single("picture"), guarantorController.addGuarantorInformationLogic);

// EDIT GUARANTORS INFORMATION FORM
router.get("/guarantor/edit/:id", isLoggedIn, guarantorController.editGuarantor);

// EDIT GUARANTORS INFORMATION FORM LOGIC
router.put("/guarantor/edit/:id", files.single("picture"), guarantorController.edituarantorLogic);

// EXPORTING THE ROUTER
module.exports = router;
