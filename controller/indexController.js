const   nodemailer              = require('nodemailer');

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

// APPLY PAGE
exports.apply = (req, res) => {
    res.render("apply", {
        title : "Loan System Apply Page"
    });
}

exports.login = (req, res) => {
    res.render("login", {
        title : "Loan System Login Page"
    });
}
