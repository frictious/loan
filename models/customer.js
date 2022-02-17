const   mongoose                = require('mongoose');

const customerSchema = mongoose.Schema({
    name : String,
    age : Number,
    address : String,
    contact : String,
    email : String,
    password : String,
    picture : String,
    pictureName : String,
    educationalQualification : String,
    nationalIDNumber : String,
    numberOfFamilyMembers : Number,
    monthlyIncome : Number,
    monthlyExpenditure : Number,
    memberNo : Number,
    mothersName : String,
    fathersName : String,
    role : String,
});

module.exports = mongoose.model("Customers", customerSchema);
