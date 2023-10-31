const mongoose = require("mongoose");
const shortId = require("shortid");
const uuid = require("uuid");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;
const objectId = Schema.ObjectId;

const UserSchema = new Schema({
  _id: {
    type: String,
    default: uuid.v4,
  },
  username: { type: String, required: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: new Date() },
  gender: { type: String, required: true, enum: ["male", "female"] },
  email: { type: String, unique: true },
  contact: { type: String, required: true },
  phone_number: { type: String, required: true },
});

// UserSchema.pre("save", async function(next) {
//     const user = this;
//     const hash = await bcrypt.hash(this.password, 12);
//     this.password = hash;
//     next();
// })

// UserSchema.methods.isValidatePassword = async function(password) {
//     console.log(password);
//     const user = this;
//     const compare = await bcrypt.compare(password, user.password);
//     return compare;
// }

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
