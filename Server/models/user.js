const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

  role: {
    type: String,
    enum: ['renter', 'provider'],
    default: 'renter'
  },

  uploadedFiles: [
    {
      fileName: String,
      fileSize: Number,
      fileType: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      },
      providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider'
      },
      downloadUrl: String,
      ipfsHash: String,
      status: {
        type: String,
        enum: ['available', 'pending', 'deleted'],
        default: 'available'
      }
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
