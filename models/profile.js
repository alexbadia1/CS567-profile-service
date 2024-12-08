const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: [true, "firebaseID is required"], unique: true },
  email: { type: String, required: [true, "email is required"] },
  politicalAffiliation: { type: String, required: [true, "politicalAffiliation is required"] },
  survey: {
    type: Map,
    of: {
      wouldCite: { type: Boolean, default: null }
    }
  }
});

module.exports = mongoose.model("Profile", ProfileSchema);
