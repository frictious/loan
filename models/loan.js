const   mongoose                = require("mongoose");

const loanSchema = mongoose.Schema({
    amount : Number,
    duration : Number,
    installmentSize : Number,
    purpose : String, // Purpose of Loan
    sectorName : String,
    sectorCode : String,
    interest : Number, // Interest is 40% fixed
    status : String, // Whether the loan was approved or not
    amountDue : Number,
    amountPaid : Number,
    amountPaying : Number,
    type : String, // The type of loan, whether individual or group
    customer : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Customer"
    },
    approvedBy : String,
    from : Date, // When the loan was approved
    to : Date, // When the loan  should be paid
    groupmemberone : String,
    groupmembertwo : String,
    groupmemberthree : String,
    groupmemberfour : String,
    groupmemberfive : String,
    groupmembersix : String,
    groupmemberseven : String,
    groupmembereight : String,
    groupmembernine : String,
    groupmemberten : String,
    request : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Request"
    },
});

module.exports = mongoose.model("Loan", loanSchema);
