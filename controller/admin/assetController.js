const   Asset                   = require("../../models/assets"),
        Customer                = require("../../models/customer"),        
        crypto                  = require("crypto"),
        path                    = require("path"),
        multer                  = require("multer"),
        {GridFsStorage}         = require("multer-gridfs-storage"),
        Grid                    = require("gridfs-stream"),
        mongoose                = require("mongoose")
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
// ASSET SECTION
// ADD ASSET FORM
exports.addAssetInformation = (req, res) => {
    Customer.findById({_id : req.params.id})
    .then(customer => {
        res.render("admin/asset/addAsset", {
            title : "Microfinance Admin Dashboard Add Customer Assets Page",
            customer : customer
        });
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// ADD ASSET INFORMATION FORM LOGIC
exports.addAssetInformationLogic = (req, res) => {
    Asset.create({
        name : req.body.name,
        particulars : req.body.particulars,
        quantity : req.body.quantity,
        marketValue : req.body.marketValue,
        acres : req.body.acres,
        plotNo : req.body.plotNo,
        houseNo : req.body.houseNo,
        otherIdentification : req.body.otherIdentification,
        document : req.file.filename,
        documentName : req.file.originalName,
        customer : req.body.id
    })
    .then(asset => {
        Customer.findById({_id : req.body.id})
        .then(customer => {
            const mailOptions = {
                from: process.env.EMAIL,
                to: customer.email,
                subject: "BRAC SL Microfinance Customer Account Information",
                html: `<p>Dear ${customer.name},</p> <p>Your asset <strong>${asset.name}'s</strong> information has been entered successfully into our database.</p>
                
                <p>Thank you for registering your asset information with us to help fast track your loan process in the future.</p>
    
                <p>Regards</p>
    
                <p>BRAC SL Management</p>
                `
            }
    
            transport.sendMail(mailOptions, (err, mail) => {
                if(!err){
                    console.log("MAIL SENT SUCCESSFULLY");
                    console.log("CUSTOMER ASSET INFORMATION ADDED SUCCESSFULLY");
                    res.redirect(`/admin/guarantor/add/${customer._id}`);
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

// EDIT ASSET FORM
exports.editAsset = (req, res) => {
    Asset.findById({_id : req.params.id})
    .then(asset => {
        res.render("admin/asset/editAsset", {
            title : "Microfinance Admin Dashboard Edit Customer ASSET Information Form",
            asset : asset
        });
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// EDIT ASSET FORM LOGIC
exports.editAssetLogic = (req, res) => {
    if(req.body.document !== ""){
        Asset.findByIdAndUpdate({_id : req.params.id}, {
            name : req.body.name,
            particulars : req.body.particulars,
            quantity : req.body.quantity,
            marketValue : req.body.marketValue,
            acres : req.body.acres,
            plotNo : req.body.plotNo,
            houseNo : req.body.houseNo,
            otherIdentification : req.body.otherIdentification,
            document : req.files.filename,
            documentName : req.files.originalName,
        })
        .then(asset => {
            console.log("CUSTOMER ASSET INFORMATION UPDATED SUCCESSFULLY");
            res.redirect("back");
        })    
        .catch(err => {
            console.log(err);
            res.redirect("back");
        });
    }else{
        Asset.findByIdAndUpdate({_id : req.params.id}, {
            name : req.body.name,
            particulars : req.body.particulars,
            quantity : req.body.quantity,
            marketValue : req.body.marketValue,
            acres : req.body.acres,
            plotNo : req.body.plotNo,
            houseNo : req.body.houseNo,
            otherIdentification : req.body.otherIdentification
        })
        .then(asset => {
            console.log("CUSTOMER ASSET INFORMATION UPDATED SUCCESSFULLY");
            res.redirect("back");
        })    
        .catch(err => {
            console.log(err);
            res.redirect("back");
        });
    }
}

// END OF ASSET SECTION
// =================================================================================