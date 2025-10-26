const mongoose = require("mongoose");

const algorithmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdBy: { type: String, required: true }, // Clerk userId
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Algorithm", algorithmSchema);
