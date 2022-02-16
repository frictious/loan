const   mongoose                = require("mongoose");

const requestSchema = mongoose.Schema({
    customer : String,
    amount : Number,
    purpose : String,
    type : String,
    duration : Number,
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
});

module.exports = mongoose.model("Request", requestSchema);
