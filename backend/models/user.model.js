const mongoose = require('mongoose');

const Schema = mongoose.Schema; 

const userSchema = new Schema({
    fullName: { type: String},
    email: { type: String },
    password: { type: String },
    createdAt: { type: Date, default: Date.now() },
});

userSchema.methods.getId = function() {
    return this._id.toString();
}

module.exports = mongoose.model('User', userSchema);