const   mongoose                    = require("mongoose");

const businessSchema = mongoose.Schema({
    name : String,
    description : String,
    address : String,
    nature : String, // Manufacturing, Trading, Service
    experience : Number, // How many years of experience does the business have
    regNo : Number,
    bankName : String,
    bankAddress : String,
    bankAccountNo : Number,
    isTaxPayer : String, // YES OR NO
    TIN : String,
    customer : String
});

module.exports = mongoose.model("Business", businessSchema);
