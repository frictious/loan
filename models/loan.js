const   mongoose                = require("mongoose");

const loanSchema = mongoose.Schema({
    amount : Number,
    duration : Number,
    interest : Number,
    status : String, // Whether the loan was approved or not
    amountDue : Number
})
