const   Business                    = require("../../models/business"),
        Customer                    = require("../../models/customer");

// =================================================================================
// BUSINESS SECTION
// ADD BUSINESS FORM
exports.addBusinessInformation = (req, res) => {
    res.render("admin/business/addbusiness", {
        title : "Microfinance Admin Dashboard Add Customer Business Page",
    });
}

// ADD BUSINESS INFORMATION FORM LOGIC
exports.addBusinessInformationLogic = (req, res) => {
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
        customer : req.params.id
    })
    .then(business => {
        console.log("CUSTOMER BUSINESS INFORMATION ADDED SUCCESSFULLY");
        res.redirect(`/admin/guarantor/${req.params.id}`);
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