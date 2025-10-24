const Connection = require('../models/Connection');
const Profile = require('../models/Profile');
const User = require('../models/User');
const { sendConnectionRequestEmail } = require('../services/emailService');

async function sendRequest(req, res, next) {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ status: 'error', message: 'Not authenticated' });
    const requester = req.user.id;
    const { recipientId } = req.body;
    if (!recipientId) return res.status(400).json({ status: 'error', message: 'recipientId required' });
    if (recipientId === requester) return res.status(400).json({ status: 'error', message: 'Cannot send request to yourself' });

    const recipient = await User.findById(recipientId);
    if (!recipient) return res.status(404).json({ status: 'error', message: 'Recipient not found' });

    const existing = await Connection.findOne({ requester, recipient: recipientId });
    if (existing) return res.status(409).json({ status: 'error', message: 'Request already exists' });

    const conn = await Connection.create({ requester, recipient: recipientId });
    
    // Send email notification
    const requesterProfile = await Profile.findOne({ user: requester });
    const recipientProfile = await Profile.findOne({ user: recipientId });
    const recipientUser = await User.findById(recipientId);
    
    if (recipientUser.email) {
      await sendConnectionRequestEmail(
        recipientUser.email,
        requesterProfile?.name || 'Someone',
        recipientProfile?.name || recipientUser.name || 'User'
      );
    }

    res.status(201).json({ status: 'success', data: conn });
  } catch (err) {
    next(err);
  }
}

async function acceptRequest(req, res, next) {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ status: 'error', message: 'Not authenticated' });
    const userId = req.user.id;
    const { id } = req.params;
    const conn = await Connection.findById(id);
    if (!conn) return res.status(404).json({ status: 'error', message: 'Connection not found' });
    if (conn.recipient.toString() !== userId) return res.status(403).json({ status: 'error', message: 'Not authorized' });

    conn.status = 'accepted';
    conn.updatedAt = new Date();
    await conn.save();
    res.json({ status: 'success', data: conn });
  } catch (err) {
    next(err);
  }
}

async function rejectRequest(req, res, next) {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ status: 'error', message: 'Not authenticated' });
    const userId = req.user.id;
    const { id } = req.params;
    const conn = await Connection.findById(id);
    if (!conn) return res.status(404).json({ status: 'error', message: 'Connection not found' });
    if (conn.recipient.toString() !== userId) return res.status(403).json({ status: 'error', message: 'Not authorized' });

    conn.status = 'rejected';
    conn.updatedAt = new Date();
    await conn.save();
    res.json({ status: 'success', data: conn });
  } catch (err) {
    next(err);
  }
}

async function listConnections(req, res, next) {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ status: 'error', message: 'Not authenticated' });
    const userId = req.user.id;
    const { status } = req.query;
    const q = { $or: [{ requester: userId }, { recipient: userId }] };
    if (status) q.status = status;
    const conns = await Connection.find(q).populate('requester', 'name').populate('recipient', 'name').sort({ createdAt: -1 });
    res.json({ status: 'success', data: conns });
  } catch (err) {
    next(err);
  }
}

module.exports = { sendRequest, acceptRequest, rejectRequest, listConnections };
