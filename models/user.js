const   mongoose                = require("mongoose");

const userSchema = mongoose.Schema({
    name : {
        type: String,
        required : true
    },
    email : String,
    password : String,
    role : String
});

module.exports = mongoose.model("Users", userSchema);
