const   mongoose                = require("mongoose");

const guarantorSchema = mongoose.Schema({
    name : String,
    age : Number,
    picture : String,
    pictureName : String,
    residentialAddress : String,
    permanentAddress : String,
    mobile : String,
    occupation : String,
    designation : String,
    relationship : String,
    nationalIDNumber : String,
    monthlyIncome : Number,
    date : {
        type : Date,
        default : Date.now()
    },
    customer : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Customer"
    }
});

module.exports = mongoose.model("Guarantors", guarantorSchema);
