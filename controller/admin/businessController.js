const   Business                    = require("../../models/business"),
        nodemailer                  = require("nodemailer"),
        Customer                    = require("../../models/customer");

// NODEMAILER CONFIG
const transport = nodemailer.createTransport({
    service : "gmail",
    auth : {
        type : "login",
        user : process.env.EMAIL,
        pass : process.env.PASSWORD
    }
});

// =================================================================================
// BUSINESS SECTION
// ADD BUSINESS FORM
exports.addBusinessInformation = (req, res) => {
    Customer.findById({_id : req.params.id})
    .then(customer => {
        res.render("admin/business/addbusiness", {
            title : "Microfinance Admin Dashboard Add Customer Business Page",
            customer : customer
        });
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// ADD BUSINESS INFORMATION FORM LOGIC
exports.addBusinessInformationLogic = (req, res) => {
    Customer.findById({_id : req.body.id})
    .then(customer => {
        Business.create({
            name : req.body.name,
            description : req.body.description,
            address : req.body.address,
            nature : req.body.nature, // Manufacturing, Trading, Service
            experience : req.body.experience, // How many years of experience does the business have
            regNo : req.body.regNo,
            bankName : req.body.bankName,
            bankAddress : req.body.bankAddress,
            bankAccountNo : req.body.bankAccountNo,
            isTaxPayer : req.body.isTaxPayer, // YES OR NO
            TIN : req.body.tin,
            customer : customer._id
        })
        .then(business => {
            const mailOptions = {
                from: process.env.EMAIL,
                to: customer.email,
                subject: "BRAC SL Microfinance Customer Account Information",
                html: `<p>Dear ${customer.name},</p> <p>Your business <strong>${business.name}'s</strong> information has been entered successfully into our database.</p>
                
                <p>Thank you for registering your business information with us to help fast track your loan process in the future.</p>
    
                <p>Regards</p>
    
                <p>BRAC SL Management</p>
                `
            }
    
            transport.sendMail(mailOptions, (err, mail) => {
                if(!err){
                    console.log("MAIL SENT SUCCESSFULLY");
                    console.log("CUSTOMER BUSINESS INFORMATION ADDED SUCCESSFULLY");
                    res.redirect(`/admin/asset/add/${customer.id}`);
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

// EDIT BUSINESS FORM
exports.editbusiness = (req, res) => {
    Business.findById({_id : req.params.id})
    .then(business => {
        res.render("editBusiness", {
            title : "Microfinance Admin Dashboard Edit Customer Business Information Form",
            business : business
        });
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// EDIT BUSINESS FORM LOGIC
exports.editBusinessLogic = (req, res) => {
    Business.findByIdAndUpdate({_id : req.params.id}, {
        name : req.body.name,
        description : req.body.description,
        address : req.body.address,
        nature : req.body.nature, // Manufacturing, Trading, Service
        experience : req.body.experience, // How many years of experience does the business have
        regNo : req.body.regNo,
        bankName : req.body.bankName,
        bankAddress : req.body.bankAddress,
        bankAccountNo : req.body.bankAccountNo,
        isTaxPayer : req.body.isTaxPayer, // YES OR NO
        TIN : req.body.tin
    })
    .then(business => {
        console.log("CUSTOMER BUSINESS INFORMATION UPDATED SUCCESSFULLY");
        res.redirect("back");
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// END OF BUSINESS SECTION
// =================================================================================