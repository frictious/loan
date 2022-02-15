const   Customer                = require("../../models/customer"),
        Guarantor               = require("../../models/guarantor"),
        Asset                   = require("../../models/assets"),
        Business                = require("../../models/business"),
        Loan                    = require("../../models/loan"),
        Request                 = require("../../models/requests"),
        passport                = require("passport"),
        mongoose                = require("mongoose"),
        bcrypt                  = require("bcryptjs"),
        crypto                  = require("crypto"),
        path                    = require("path"),
        multer                  = require("multer"),
        {GridFsStorage}         = require("multer-gridfs-storage"),
        Grid                    = require("gridfs-stream"),
        nodemailer              = require("nodemailer");

require("dotenv").config();

// CONFIG
require("../../config/adminLogin")(passport);

// NODEMAILER CONFIG
const transport = nodemailer.createTransport({
    service : "gmail",
    auth : {
        type : "login",
        user : process.env.EMAIL,
        pass : process.env.PASSWORD
    }
});

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


// =================================================================================
// CUSTOMERS SECTION
// GET ALL CUSTOMERS
exports.customers = (req, res) => {
    Customer.find({})
    .then(customers => {
        res.render("admin/customer/customers", {
            title : "Microfinance Management System Customers",
            customers: customers
        });
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// VIEW CUSTOMER INFORMATION
exports.customer = (req, res) => {
    Customer.findById({_id : req.params.id})
    .then(customer => {
    Business.findOne({customer : customer._id})
    .then(business => {
    Guarantor.findOne({customer : customer._id})
    .then(guarantor => {
    Asset.findOne({customer : customer._id})
    .then(asset => {
    Loan.find({customer : customer._id})
    .then(loans => {
        if(loans.length > 0) {
            res.render("admin/customer/customer", {
                title : "Microfinance Admin Dashboard Customer Information",
                customer : customer,
                business : business,
                guarantor : guarantor,
                asset : asset,
                loans : loans
            })
        }else{
            res.render("admin/customer/customer", {
                title : "Microfinance Admin Dashboard Customer Information",
                customer : customer,
                business : business,
                guarantor : guarantor,
                asset : asset
            })
        }
    })
    })
    })
    })
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// ADD CUSTOMER FORM
exports.addCustomer = (req, res) => {
    res.render("admin/customer/addcustomer", {
        title : "Microfinance Admin Dashboard Add Customer Page",
    });
}

// ADD CUSTOMER FORM LOGIC
exports.addCustomerLogic = (req, res) => {
    if(req.file.mimetype === "image/jpg" || req.file.mimetype === "image/png" || req.file.mimetype === "image/jpeg"){
        Customer.create({
            name : req.body.name,
            age : req.body.age,
            address : req.body.address,
            email : req.body.email,
            picture : req.file.filename,
            pictureName : req.file.originalname,
            educationalQualification : req.body.educationalQualification,
            nationalIDNumber : req.body.nationalIDNumber,
            numberOfFamilyMembers : req.body.numberOfFamilyMembers,
            monthlyIncome : req.body.monthlyIncome,
            monthlyExpenditure : req.body.monthlyExpenditure,
            memberNo : req.body.memberNo,
            mothersName : req.body.mothersName,
            fathersName : req.body.fathersName
        })
        .then(customer => {
            console.log("CUSTOMER INFORMATION ADDED SUCCESSFULLY");
            res.redirect(`/admin/business/add/${customer._id}`);
        })
        .catch(err => {
            console.log(err);
            res.redirect("back");
        });
    }else{
        console.log("FILE MUST BE A PICTURE");
    }
}

// EDIT CUSTOMER FORM
exports.editcustomer = (req, res) => {
    Customer.findById({_id : req.params.id})
    .then(customer => {
        res.render("editcustomer", {
            title : "Microfinance Admin Dashboard Edit Customer Form",
            customer : customer
        });
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// EDIT CUSTOMER FORM LOGIC
exports.editCustomerLogic = (req, res) => {
    if(req.body.picture !== undefined) {
        if(req.file.mimetype === "image/jpg" || req.file.mimetype === "image/png" || req.file.mimetype === "image/jpeg"){
            Customer.findByIdAndUpdate({_id : req.params.id}, {
                name : req.body.name,
                age : req.body.age,
                address : req.body.address,
                email : req.body.email,
                picture : req.file.filename,
                pictureName : req.file.originalname,
                educationalQualification : req.body.educationalQualification,
                nationalIDNumber : req.body.nationalIDNumber,
                numberOfFamilyMembers : req.body.numberOfFamilyMembers,
                monthlyIncome : req.body.monthlyIncome,
                monthlyExpenditure : req.body.monthlyExpenditure,
                memberNo : req.body.memberNo,
                mothersName : req.body.mothersName,
                fathersName : req.body.fathersName
            })
            .then(customer => {
                console.log("CUSTOMER INFORMATION UPDATED SUCCESSFULLY");
                res.redirect("back");
            })
            .catch(err => {
                console.log(err);
                res.redirect("back");
            });
        }else{
            console.log("FILE MUST BE A PICTURE");
        }
    }else{
        Customer.findByIdAndUpdate({_id : req.params.id}, {
            name : req.body.name,
            age : req.body.age,
            address : req.body.address,
            email : req.body.email,
            educationalQualification : req.body.educationalQualification,
            nationalIDNumber : req.body.nationalIDNumber,
            numberOfFamilyMembers : req.body.numberOfFamilyMembers,
            monthlyIncome : req.body.monthlyIncome,
            monthlyExpenditure : req.body.monthlyExpenditure,
            memberNo : req.body.memberNo,
            mothersName : req.body.mothersName,
            fathersName : req.body.fathersName
        })
        .then(customer => {
            console.log("CUSTOMER INFORMATION UPDATED SUCCESSFULLY");
            res.redirect("back");
        })
        .catch(err => {
            console.log(err);
            res.redirect("back");
        });
    }
}

// DELETE CUSTOMER
exports.deleteCustomer = (req, res) => {
    Customer.findById({_id : req.params.id})
    .then(customer => {
        Guarantor.findByIdAndDelete({_id : customer._id})
        .then(guarantor => {console.log("CUSTOMER GUARANTOR INFORMATION DELETED SUCCESSFULLY");})
        Asset.findByIdAndDelete({_id : customer._id})
        .then(asset => {console.log("CUSTOMER ASSET INFORMATION DELETED SUCCESSFULLY");})
        Business.findByIdAndDelete({_id : customer._id})
        .then(business => {console.log("CUSTOMER BUSINESS INFORMATION DELETED SUCCESSFULLY");})
        Customer.findByIdAndDelete({_id : customer._id})
        .then(customer => {
            console.log("CUSTOMER INFORMATION DELETED SUCCESSFULLY");
            res.redirect("back");
        })
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// END OF CUSTOMERS SECTION
// =================================================================================
