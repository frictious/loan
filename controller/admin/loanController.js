const   Loan                    = require("../../models/loan"),
        Customer                = require("../../models/customer"),
        nodemailer              = require("nodemailer"),
        Request                 = require("../../models/requests");

require("dotenv").config();
//Nodemailer configuration
const transport = nodemailer.createTransport({
    service : "gmail",
    auth:{
        type: "login",
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

// =================================================================================
// LOAN SECTION
// REQUESTS
exports.requests = (req, res) => {
    Request.find({})
    .then(requests => {
        Customer.find({})
        .then(customers => {
            if(customers){
                res.render("admin/requests", {
                    title : "Microfinance Admin Dashboard Customers Requests",
                    requests : requests,
                    customers : customers
                });
            }else{
                res.render("admin/requests", {
                    title : "Microfinance Admin Dashboard Customers Requests",
                    requests : requests
                });
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// APPROVE REQUEST FORM
exports.approverequest = (req, res) => {
    Request.findById({_id : req.params.id})
    .then(request => {
        Customer.findById({_id : request.customer})
        .then(customer => {
            if(customer){
                res.render("admin/loan/approved", {
                    title : "Microfinance Admin Dashboard Loan Approval Form",
                    request : request,
                    customer : customer
                });
            }else{
                res.render("admin/loan/approved", {
                    title : "Microfinance Admin Dashboard Loan Approval Form",
                    request : request
                });
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// APPROVE REQUEST FORM LOGIC
exports.approverequestLogic = (req, res) => {
    Request.findByIdAndUpdate({_id : req.params.id}, {status : "Approved"})
    .then(request => {
        Loan.findOneAndUpdate({customer : request.customer}, {
            status : "Approved",
            amountPaid : 0,
            amountDue : (request.amount - 0)
        })
        .then(loan => {
            Customer.findById({_id : loan.customer})
            .then(customer => {
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: customer.email,
                    subject: "BRAC SL Microfinance Loan Approval Information",
                    html: `<p>Dear ${customer.name},</p> <p>Your request for a loan of ${loan.amount} has been approved.</p>
                    <p>The interest to pay will be <strong>Le ${loan.interest}</strong>.</p>
                    <p>You are to pay a total of <strong>Le ${loan.amount + loan.interest}</strong> in <strong>${loan.installmentSize}</strong> installments over <strong>${loan.duration} months</strong>, starting from the day the loan will be given to you.</p>

                    <p>Each month, you are to pay <strong>Le ${Math.floor((loan.amount + loan.interest)/loan.installmentSize)}</strong>
    
                    <p>Thank you</p>
    
                    <p>Regards</p>
    
                    <p>BRAC SL Management</p>
                    `
                }
    
                transport.sendMail(mailOptions, (err, mail) => {
                    if(!err){
                        console.log("MAIL SENT SUCCESSFULLY");
                        console.log("LOAN REQUEST APPROVED");
                        res.redirect("back");
                    }else{
                        console.log(err);
                        res.redirect("back");
                    }
                })
            })
            .catch(err => {
                console.log(err);
                res.redirect("back");
            });
        })
        .catch(err => {
            console.log(err);
            res.redirect("back");
        });
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// REJECT REQUEST FORM
exports.rejectrequest = (req, res) => {
    Request.findById({_id : req.params.id})
    .then(request => {
        Customer.findById({_id : request.customer})
        .then(customer => {
            if(customer){
                res.render("admin/loan/rejected", {
                    title : "Microfinance Admin Dashboard Loan Rejection Form",
                    request : request,
                    customer : customer
                });
            }else{
                res.render("admin/loan/rejected", {
                    title : "Microfinance Admin Dashboard Loan Rejection Form",
                    request : request
                });
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// REJECT REQUEST FORM LOGIC
exports.rejectrequestLogic = (req, res) => {
    Request.findByIdAndUpdate({_id : req.params.id}, {status : "Rejected"})
    .then(request => {
        Loan.findOneAndUpdate({customer : request.customer}, {status : "Rejected"})
        .then(loan => {
            Customer.findById({_id : loan.customer})
            .then(customer => {
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: customer.email,
                    subject: "BRAC SL Microfinance Loan Rejection Information",
                    html: `<p>Dear ${customer.name},</p> <p>Your request for a loan of ${loan.amount} has been rejected due to the fact that you do not meet the requirements for that particular amount for a loan.</p>
    
                    <p>Thank you</p>
    
                    <p>Regards</p>
    
                    <p>BRAC SL Management</p>
                    `
                }
    
                transport.sendMail(mailOptions, (err, mail) => {
                    if(!err){
                        console.log("MAIL SENT SUCCESSFULLY");
                        console.log("LOAN REQUEST REJECTED");
                        res.redirect("back");
                    }else{
                        console.log(err);
                        res.redirect("back");
                    }
                });
            })
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
        Customer.find({})
        .then(customers => {
            if(customers){
                res.render("admin/loan/loans", {
                    title : "Microfinance Admin Dashboard Customer Loans",
                    loans : loans,
                    customers : customers
                });
            }else{
                res.render("admin/loan/loans", {
                    title : "Microfinance Admin Dashboard Customer Loans",
                    loans : loans
                })
            }
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
        amountDue : (req.body.amountDue - req.body.amountPaid),
        amountPaid : 0,
        type : req.body.type, // The type of loan, whether individual or group
        customer : req.params.id,
        approvedBy : req.user._id,
        status : "Approved",
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
        Customer.findById({_id : req.params.id})
        .then(customer => {
            const mailOptions = {
                from: process.env.EMAIL,
                to: customer.email,
                subject: "BRAC SL Microfinance Loan Information",
                html: `<p>Dear ${customer.name},</p> <p>Your loan for <strong>${loan.amount}</strong> information has been entered received successfully and is currently being processed.</p>
                
                <p>You will receive a confirmation or rejection message once the process is complete</p>
    
                <p>Regards</p>
    
                <p>BRAC SL Management</p>
                `
            }
    
            transport.sendMail(mailOptions, (err, mail) => {
                if(!err){
                    console.log("MAIL SENT SUCCESSFULLY");
                    console.log("CUSTOMER LOAN INFORMATION ADDED SUCCESSFULLY");
                    res.redirect(`/admin/loan/${req.params.id}`);
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

// EDIT LOAN FORM
exports.editloan = (req, res) => {
    Loan.findById({_id : req.params.id})
    .then(loan => {
        Customer.findById({_id : loan.customer})
        .then(customer => {
            if(customer){
                res.render("admin/loan/editloan", {
                    title : "Microfinance Admin Dashboard Edit Customer Loan Information Form",
                    customer : customer,
                    loan : loan
                });
            }else{
                res.render("editLoan", {
                    title : "Microfinance Admin Dashboard Edit Customer Loan Information Form",
                    loan : loan
                });
            }
        })
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
        amountDue : (req.body.amount - (req.body.amountPaid + req.body.amountPaying)),
        amountPaid : (req.body.amountPaid + req.body.amountPaying),
        amountPaying : req.body.amountPaying,
        status : req.body.status,
        from : req.body.from,
        to : req.body.to,
        approvedBy : req.user._id,
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