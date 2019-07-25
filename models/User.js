const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        default: "",
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        default: "",
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    type: {
        type: String,
        default: "user"
    }
});

UserSchema.methods.generatePasswordHash = function(string) {
    return bcrypt.hashSync(string, bcrypt.genSaltSync(10), null);
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
