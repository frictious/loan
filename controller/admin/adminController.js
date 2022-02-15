const   Customer                = require("../../models/customer"),
        User                    = require("../../models/user"),
        Guarantor               = require("../../models/guarantor"),
        Asset                   = require("../../models/assets"),
        Business                = require("../../models/business"),
        Loan                    = require("../../models/loan"),
        Request                 = require("../../models/requests"),
        bcryptjs                = require("bcryptjs"),
        passport                = require("passport");

require("../../config/adminLogin")(passport);

// DASHOBARD PAGE
exports.index = (req, res) => {
    res.render("admin/index", {
        title : "Loan System Admin Dashboard"
    });
}

// GET USERS
exports.users = (req, res) => {
    User.find({})
    .then(admins => {
        res.render("admin/admin/admins", {
            title : "Microfinance Admin Dashboard Admins Page",
            admins : admins
        });
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// ADD USER FORM
exports.adduser = (req, res) => {
    res.render("admin/admin/register", {
        title : "Microfinance Admin Dashboard Admin Registration Page"
    });
}

// ADD USER FORM LOGIC
exports.adduserLogic = (req, res) => {
    if(req.body.password === req.body.repassword){
        bcryptjs.genSalt(10)
        .then(salt => {
            bcryptjs.hash(req.body.password, salt)
            .then(hash => {
                User.create({
                    name : req.body.name,
                    email : req.body.email,
                    role : req.body.role,
                    password : hash
                })
                .then(admin => {
                    console.log("USER REGISTERED SUCCESSFULLY");
                    res.redirect("back");
                })
            })
        })
        .catch(err => {
            console.log(err);
            rs.redirect("back");
        });
    }else{
        console.log("PASSWORDS DO NOT MATCH");
        res.redirect("back");
    }
}

// EDIT USER FORM
exports.edituser = (req, res) => {
    User.findById({_id : req.params.id})
    .then(user => {
        res.render("admin/admin/profile", {
            title : "Microfinance Admin Dashboard Admin Profile Page",
            user : user
        });
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// EDIT USER FORM LOGIC
exports.edituserLogic = (req, res) => {
    if(req.body.password === req.body.repassword && req.body.password !== ""){
        bcryptjs.genSalt(10)
        .then(salt => {
            bcryptjs.hash(req.body.password, salt)
            .then(hash => {
                User.findByIdAndUpdate({_id : req.params.id}, {
                    name : req.body.name,
                    email : req.body.email,
                    role : req.body.role,
                    password : hash
                })
                .then(admin => {
                    console.log("USER ACCOUNT UPDATED SUCCESSFULLY");
                    res.redirect("back");
                })
                .catch(err => {
                    console.log(err);
                    rs.redirect("back");
                });
            })
        })
        .catch(err => {
            console.log(err);
            rs.redirect("back");
        });
    }else{
        User.findByIdAndUpdate({_id : req.params.id}, {
            name : req.body.name,
            email : req.body.email,
            role : req.body.role
        })
        .then(admin => {
            console.log("USER ACCOUNT UPDATED SUCCESSFULLY");
            res.redirect("back");
        })
        .catch(err => {
            console.log(err);
            res.redirect("back");
        });
    }
}

// DELETE USER
exports.deleteUser = (req, res) => {
    User.findByIdAndDelete({_id : req.params.id})
    .then(user => {
        console.log("USER INFORMATION DELETED SUCCESSFULLY");
        res.redirect("back");
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// LOGIN ROUTE
exports.login = (req, res) => {
    res.render("admin/login", {
        title : "Microfinance Admin Login Page"
    });
}

// LOGIN LOGIC
exports.loginLogic = (req, res, next) => {
    passport.authenticate("local", {
        successRedirect : "/admin",
        failureRedirect : "/admin/login"
    })(req, res, next);
}
