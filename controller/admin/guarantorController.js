const   Guarantor               = require("../../models/guarantor"),
        crypto                  = require("crypto"),
        path                    = require("path"),
        multer                  = require("multer"),
        {GridFsStorage}         = require("multer-gridfs-storage"),
        Grid                    = require("gridfs-stream"),
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
    res.render("admin/guarantor/addGuarantor", {
        title : "Microfinance Admin Dashboard Add Customer Guarantors Page",
    });
}

// ADD GUARANTOR INFORMATION FORM LOGIC
exports.addGuarantorInformationLogic = (req, res) => {
    Guarantor.create({
        name : req.body.name,
        age : req.body.age,
        picture : req.files.filename,
        pictureName : req.files.originalName,
        residentialAddress : req.body.residentialAddress,
        permanentAddress : req.body.permanentAddress,
        mobile : req.body.mobile,
        occupation : req.body.occupation,
        designation : req.body.designation,
        relationship : req.body.relationship,
        nationalIDNumber : req.body.nationalIDNumber,
        monthlyIncome : req.body.monthlyIncome,
        customer : req.params.id
    })
    .then(guarantor => {
        console.log("CUSTOMER GUARANTOR INFORMATION ADDED SUCCESSFULLY");
        res.redirect("/admin/customers");
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
    if(req.body.picture !== ""){
        Guarantor.findByIdAndUpdate({_id : req.params.id}, {
            name : req.body.name,
            age : req.body.age,
            picture : req.files.filename,
            pictureName : req.files.originalName,
            residentialAddress : req.body.residentialAddress,
            permanentAddress : req.body.permanentAddress,
            mobile : req.body.mobile,
            occupation : req.body.occupation,
            designation : req.body.designation,
            relationship : req.body.relationship,
            nationalIDNumber : req.body.nationalIDNumber,
            monthlyIncome : req.body.monthlyIncome,
            customer : req.params.id
        })
        .then(GUARANTOR => {
            console.log("CUSTOMER GUARANTOR INFORMATION UPDATED SUCCESSFULLY");
            res.redirect("back");
        })    
        .catch(err => {
            console.log(err);
            res.redirect("back");
        });
    }else{
        Guarantor.findByIdAndUpdate({_id : req.params.id}, {
            name : req.body.name,
            age : req.body.age
            residentialAddress : req.body.residentialAddress,
            permanentAddress : req.body.permanentAddress,
            mobile : req.body.mobile,
            occupation : req.body.occupation,
            designation : req.body.designation,
            relationship : req.body.relationship,
            nationalIDNumber : req.body.nationalIDNumber,
            monthlyIncome : req.body.monthlyIncome,
            customer : req.params.id
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
}

// END OF GUARANTOR SECTION
// =================================================================================