const   Loan                    = require("../../models/loan"),
        Request                 = require("../../models/requests");

// =================================================================================
// LOAN SECTION
// REQUESTS
exports.requests = (req, res) => {
    Request.find({})
    .then(requests => {
        res.render("admin/requests", {
            title : "Microfinance Admin Dashboard Customers Requests",
            requests : requests
        });
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// DELETE REQUEST
exports.deleteRequest = (req, res) => {
    Request.findByIdAndDelete({_id : req.params.id})
    .then(request => {
        console.log("REQUEST DELETED SUCCESSFULLY");
        res.redirect("back");
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// VIEW ALL LOANS
exports.loans = (req, res) => {
    Loan.find({})
    .then(loans => {
        res.render("admin/loan/loans", {
            title : "Microfinance Admin Dashboard Customer Loans",
            loans : loans
        })
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// ADD LOAN FORM
exports.addLoan = (req, res) => {
    if(req.params.id !== undefined){
        Request.findById({_id : req.params.id})
        .then(request => {
            res.render("admin/loan/addloan", {
                title : "Microfinance Admin Dashboard Add Customer Loan Page",
                request : request
            });    
        })
    }else{
        res.render("admin/loan/addloan", {
            title : "Microfinance Admin Dashboard Add Customer Loan Page",
        });
    }
}

// ADD LOAN INFORMATION FORM LOGIC
exports.addLoanLogic = (req, res) => {
    Loan.create({
        amount : req.body.amount,
        duration : req.body.duration,
        installmentSize : req.body.installmentSize,
        purpose : req.body.purpose, // Purpose of Loan
        sectorName : req.body.sectorName,
        sectorCode : req.body.sectorCode,
        interest : req.body.interest, // Interest is 40% fixed
        status : req.body.status, // Whether the loan was approved or not
        amountDue : req.body.amountDue,
        amountPaid : req.body.amountPaid,
        type : req.body.type, // The type of loan, whether individual or group
        customer : req.params.id,
        approvedBy : req.user._id,
        groupmemberone : req.body.groupmemberone,
        groupmembertwo : req.body.groupmembertwo,
        groupmemberthree : req.body.groupmemberthree,
        groupmemberfour : req.body.groupmemberfour,
        groupmemberfive : req.body.groupmemberfive,
        groupmembersix : req.body.groupmembersix,
        groupmemberseven : req.body.groupmemberseven,
        groupmembereight : req.body.groupmembereight,
        groupmembernine : req.body.groupmembernine,
        groupmemberten : req.body.groupmemberten
    })
    .then(loan => {
        console.log("CUSTOMER LOAN INFORMATION ADDED SUCCESSFULLY");
        res.redirect(`/admin/loan/${req.params.id}`);
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// EDIT LOAN FORM
exports.editloan = (req, res) => {
    Loan.findById({_id : req.params.id})
    .then(loan => {
        res.render("editLoan", {
            title : "Microfinance Admin Dashboard Edit Customer Loan Information Form",
            loan : loan
        });
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// EDIT LOAN FORM LOGIC
exports.editLoanLogic = (req, res) => {
    Loan.findByIdAndUpdate({_id : req.params.id}, {
        amount : req.body.amount,
        duration : req.body.duration,
        installmentSize : req.body.installmentSize,
        purpose : req.body.purpose, // Purpose of Loan
        sectorName : req.body.sectorName,
        sectorCode : req.body.sectorCode,
        interest : req.body.interest, // Interest is 40% fixed
        status : req.body.status, // Whether the loan was approved or not
        amountDue : req.body.amountDue,
        amountPaid : req.body.amountPaid,
        type : req.body.type, // The type of loan, whether individual or group
        groupmemberone : req.body.groupmemberone,
        groupmembertwo : req.body.groupmembertwo,
        groupmemberthree : req.body.groupmemberthree,
        groupmemberfour : req.body.groupmemberfour,
        groupmemberfive : req.body.groupmemberfive,
        groupmembersix : req.body.groupmembersix,
        groupmemberseven : req.body.groupmemberseven,
        groupmembereight : req.body.groupmembereight,
        groupmembernine : req.body.groupmembernine,
        groupmemberten : req.body.groupmemberten
    })
    .then(loan => {
        console.log("CUSTOMER LOAN INFORMATION UPDATED SUCCESSFULLY");
        res.redirect("back");
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// DELETE LOAN INFORMATION
exports.deleteLoan = (req, res) => {
    Loan.findByIdAndDelete({_id : req.params.id})
    .then(loan => {
        console.log("CUSTOMER LOAN INFORMATION DELETED SUCCESSFULLY");
        res.redirect("back");
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}