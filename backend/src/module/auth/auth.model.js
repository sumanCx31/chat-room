const { default: mongoose } = require("mongoose");

const authSchema =  new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    accessToken:{
        type: String,
        required: true,
    },
    refreshToken:{
        type: String,
        required: true,
    },
    maskedAccessToken:{
        type: String,
        required: true,
    },
    maskedRefreshToken:{
        type: String,
        required: true,
    },
    client:{
        type: String,
    }
},{
    timestamps: true,
    autoCreate: true,
    autoIndex: true
})

const AuthModel = mongoose.model("Auth", authSchema);

module.exports = AuthModel;