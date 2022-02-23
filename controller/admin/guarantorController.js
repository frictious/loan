const   Guarantor               = require("../../models/guarantor"),
        Customer                = require("../../models/customer"),
        crypto                  = require("crypto"),
        path                    = require("path"),
        multer                  = require("multer"),
        {GridFsStorage}         = require("multer-gridfs-storage"),
        Grid                    = require("gridfs-stream"),
        mongoose                = require("mongoose"),
        nodemailer              = require("nodemailer");

require("dotenv").config();

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
// GUARANTOR SECTION
// ADD GUARANTOR FORM
exports.addGuarantorInformation = (req, res) => {
    Customer.findById({_id : req.params.id})
    .then(customer => {
        res.render("admin/guarantor/addGuarantor", {
            title : "Microfinance Admin Dashboard Add Customer Guarantors Page",
            customer : customer
        });
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// ADD GUARANTOR INFORMATION FORM LOGIC
exports.addGuarantorInformationLogic = (req, res) => {
    Guarantor.create({
        name : req.body.name,
        age : req.body.age,
        picture : req.file.filename,
        pictureName : req.file.originalName,
        residentialAddress : req.body.residentialAddress,
        permanentAddress : req.body.permanentAddress,
        mobile : req.body.mobile,
        occupation : req.body.occupation,
        designation : req.body.designation,
        relationship : req.body.relationship,
        nationalIDNumber : req.body.nationalIDNumber,
        monthlyIncome : req.body.monthlyIncome,
        customer : req.body.id
    })
    .then(guarantor => {
        Customer.findById({_id : req.body.id})
        .then(customer => {
            const mailOptions = {
                from: process.env.EMAIL,
                to: customer.email,
                subject: "BRAC SL Microfinance Customer Account Information",
                html: `<p>Dear ${customer.name},</p> <p>Your guarantor <strong>${guarantor.name}'s</strong> information has been entered successfully into our database.</p>
                
                <p>Thank you for registering your guarantor's information with us to help fast track your loan process in the future.</p>
    
                <p>Regards</p>
    
                <p>BRAC SL Management</p>
                `
            }
    
            transport.sendMail(mailOptions, (err, mail) => {
                if(!err){
                    console.log("MAIL SENT SUCCESSFULLY");
                    console.log("CUSTOMER GUARANTOR INFORMATION ADDED SUCCESSFULLY");
                    res.redirect("/admin/customers");
                }else{
                    console.log(err);
                    res.redirect("back");
                }
            });
        })
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// EDIT GUARANTOR FORM
exports.editGuarantor = (req, res) => {
    Guarantor.findById({_id : req.params.id})
    .then(guarantor => {
        res.render("admin/guarantor/editGuarantor", {
            title : "Microfinance Admin Dashboard Edit Customer GUARANTOR Information Form",
            guarantor : guarantor
        });
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// EDIT GUARANTOR FORM LOGIC
exports.edituarantorLogic = (req, res) => {
    Guarantor.findByIdAndUpdate({_id : req.params.id}, {
        name : req.body.name,
        age : req.body.age,
        residentialAddress : req.body.residentialAddress,
        permanentAddress : req.body.permanentAddress,
        mobile : req.body.mobile,
        occupation : req.body.occupation,
        designation : req.body.designation,
        relationship : req.body.relationship,
        nationalIDNumber : req.body.nationalIDNumber,
        monthlyIncome : req.body.monthlyIncome            
    })
    .then(guarantor => {
        console.log("CUSTOMER GUARANTOR INFORMATION UPDATED SUCCESSFULLY");
        res.redirect("back");
    })    
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// END OF GUARANTOR SECTION
// =================================================================================