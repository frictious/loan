const   nodemailer              = require('nodemailer'),
        Request                 = require("../models/requests");

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
        groupmemberten : req.body.groupmemberten
    })
    .then(request => {
        console.log("REQUEST MADE SUCCESSFULLY");
        res.redirect("back");
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
