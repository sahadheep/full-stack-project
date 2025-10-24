const mongoose = require('mongoose');

const ConnectionSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

ConnectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });

module.exports = mongoose.models.Connection || mongoose.model('Connection', ConnectionSchema);
