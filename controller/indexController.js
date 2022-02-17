const   nodemailer              = require('nodemailer'),
        Customer                = require("../models/customer"),
        Loan                    = require("../models/loan"),
        bcrypt                  = require("bcryptjs"),
        passport                = require("passport"),
        Request                 = require("../models/requests");

require("../config/login")(passport);

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

// INDEX PAGE
exports.index = (req, res) => {
    res.render("index", {
        title : "Loan System Homepage"
    });
}

// ABOUT PAGE
exports.about = (req, res) => {
    res.render("about", {
        title : "Loan System About Page"
    });
}

// SERVICES PAGE
exports.services = (req, res) => {
    res.render("services", {
        title : "Loan System Services Page"
    });
}

// CONTACT PAGE
exports.contact = (req, res) => {
    res.render("contact", {
        title : "Loan System Contact Page"
    });
}

// CONTACT FORM LOGIC
exports.contactLogic = (req, res) => {
    //Send mail to student after successful registration
    const mailOptions = {
        from: req.body.email,
        to: process.env.EMAIL,
        subject : `Loan System Contact Form Message`,
        html: `<p>The following message is from the contact form</p>
        <p>The message is from ${req.body.name} </p>
        <p>The email is ${req.body.email} </p>
        <p>
            ${req.body.message}
        </p>`
    }

    //Sending mail
    transport.sendMail(mailOptions, (err, mail) => {
        if(!err){
            console.log("MAIL SENT TO ADMIN");
            res.redirect("/contact");
        }else{
            console.log(err);
        }
    });
}

// APPLY PAGE
exports.apply = (req, res) => {
    res.render("apply", {
        title : "Loan System Apply Page"
    });
}

// APPLICATION REQUEST LOGIC
exports.request = (req, res) => {
    Request.create({
        customer : req.user._id,
        amount : req.body.amount,
        purpose : req.body.purpose,
        type : req.body.type,
        duration : req.body.duration,
        groupmemberone : req.body.groupmemberone,
        groupmembertwo : req.body.groupmembertwo,
        groupmemberthree : req.body.groupmemberthree,
        groupmemberfour : req.body.groupmemberfour,
        groupmemberfive : req.body.groupmemberfive,
        groupmembersix : req.body.groupmembersix,
        groupmemberseven : req.body.groupmemberseven,
        groupmembereight : req.body.groupmembereight,
        groupmembernine : req.body.groupmembernine,
        groupmemberten : req.body.groupmemberten,
        status : "Pending",
    })
    .then(request => {
        Loan.create({
            request : request._id,
            amount : req.body.amount,
            duration : req.body.duration,
            installmentSize : req.body.duration,
            purpose : req.body.purpose,
            interest : (0.4 * req.body.amount), // Interest is 40% fixed
            status : "Pending",
            type : req.body.type,
            customer : req.user._id,
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
            console.log("LOAN REQUEST MADE SUCCESSFULLY");
            res.redirect("back");
        })
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// LOGIN PAGE
exports.login = (req, res) => {
    res.render("login", {
        title : "Loan System Login Page"
    });
}

// LOGIN LOGIC
exports.loginLogic = (req, res, next) => {
    passport.authenticate("local", {
        successRedirect : "/apply",
        failureRedirect : "/login"
    })(req, res, next);
}

// LOGOUT LOGIC
exports.logout = (req, res) => {
    req.logout();
    res.redirect("/");
}

// SETPASSWORD
exports.setpassword = (req, res) => {
    Customer.findById({_id : req.params.id})
    .then(customer => {
        res.render("setpassword", {
            title : "New Customer Account Password Set",
            customer: customer
        });
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// SETPASSWORD LOGIC
exports.setpasswordLogic = (req, res) => {
    if(req.body.password === req.body.repassword){
        bcrypt.genSalt(10)
        .then(salt => {
            bcrypt.hash(req.body.password, salt)
            .then(hash => {
                Customer.findByIdAndUpdate({_id : req.body.id}, {password : hash})
                .then(customer => {
                    console.log("CUSTOMER SET PASSWORD SUCCESSFULLY");
                    res.redirect("/login");
                })
            })
        })
        .catch(err => {
            console.log(err);
            res.redirect("back");
        });
    }else{
        console.log("PASSWORDS DO NOT MATCH");
        res.redirect("back");
    }
}
