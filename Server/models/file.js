const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // assuming User includes renter
    required: false,
  },
  storedOnProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: false,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  downloadStatus: {
    type: String,
    enum: ['not_downloaded', 'downloaded'],
    default: 'not_downloaded',
  },
  path: {
    type: String,
    required: true,
  },
  temporaryPath: {
    type: String, // path to file in temp server before syncing to provider
  },
  sha256: { type: String, required: true },
  isSyncedToProvider: {
    type: Boolean,
    default: false,
  },
  deletedFromTempServer: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('File', fileSchema);
