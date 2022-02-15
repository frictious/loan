const   mongoose                    = require("mongoose");

const assetSchema = mongoose.Schema({
    name : String,
    particulars : String,
    quantity : Number,
    marketValue : Number, // Price in the market
    customer : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Customer"
    },
    acres : Number,
    plotNo : Number,
    houseNo : Number,
    otherIdentification : String,
    document : String,
    documentName : String
});

module.exports = mongoose.model("Assets", assetSchema);

module.exports = mongoose.model("Assets", assetSchema);
