const Group = require('../model/Group');
const { validationResult } = require('express-validator');

// @desc    Request to join a group (creates pending request)
// @route   POST /api/group/request-join/:groupId
// @access  Private
const requestJoin = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    if (!group.isActive) {
      return res.status(400).json({ success: false, message: 'This group is not active' });
    }

    if (group.members.includes(req.user.id)) {
      return res.status(400).json({ success: false, message: 'You are already a member of this group' });
    }

    if (group.members.length >= group.totalSlots) {
      return res.status(400).json({ success: false, message: 'Group is full. No more slots available.' });
    }

    const alreadyRequested = group.joinRequests?.some(r => r.user?.toString() === req.user.id && r.status === 'pending');
    if (alreadyRequested) {
      return res.status(400).json({ success: false, message: 'Join request is already pending approval' });
    }

    group.joinRequests = group.joinRequests || [];
    group.joinRequests.push({ user: req.user.id, status: 'pending', requestedAt: new Date() });
    await group.save();

    return res.status(200).json({ success: true, message: 'Join request submitted. Awaiting admin approval.' });
  } catch (error) {
    console.error('Request join error:', error);
    return res.status(500).json({ success: false, message: 'Server error while creating join request' });
  }
};

// @desc    Admin approves or rejects a join request
// @route   POST /api/group/requests/:groupId/:requestId
// @access  Private (admin only)
const handleJoinRequest = async (req, res) => {
  try {
    const { groupId, requestId } = req.params;
    const { action } = req.body; // 'approve' | 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Invalid action' });
    }

    const group = await Group.findById(groupId).populate('joinRequests.user', 'name email');
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    if (group.admin.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Only the group admin can manage join requests' });
    }

    const request = group.joinRequests.id(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Join request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Join request is already processed' });
    }

    if (action === 'approve') {
      if (group.members.length >= group.totalSlots) {
        return res.status(400).json({ success: false, message: 'Group is full. Cannot approve more members.' });
      }
      group.members.push(request.user._id);
      request.status = 'approved';
    } else {
      request.status = 'rejected';
    }
    request.respondedAt = new Date();
    request.respondedBy = req.user.id;

    await group.save();

    return res.status(200).json({ success: true, message: `Request ${action}ed`, data: { request } });
  } catch (error) {
    console.error('Handle join request error:', error);
    return res.status(500).json({ success: false, message: 'Server error while handling join request' });
  }
};

// @desc    Get pending join requests for a group (admin only)
// @route   GET /api/group/requests/:groupId
// @access  Private (admin only)
const getPendingJoinRequests = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId)
      .populate('joinRequests.user', 'name email')
      .populate('admin', 'name email');
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }
    if (group.admin._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Only the group admin can view join requests' });
    }

    const pending = (group.joinRequests || []).filter(r => r.status === 'pending');
    return res.status(200).json({ success: true, data: { requests: pending } });
  } catch (error) {
    console.error('Get pending join requests error:', error);
    return res.status(500).json({ success: false, message: 'Server error while fetching join requests' });
  }
};
// @desc    Create a new chit group
// @route   POST /api/group/create
// @access  Private
const createGroup = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, description, location, monthlyAmount, totalSlots } = req.body;

    // Check if group with same name already exists
    const existingGroup = await Group.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      admin: req.user.id 
    });

    if (existingGroup) {
      return res.status(400).json({
        success: false,
        message: 'A group with this name already exists'
      });
    }

    // Create chit group
    const group = await Group.create({
      name,
      description,
      location,
      monthlyAmount,
      totalSlots,
      admin: req.user.id,
      members: [req.user.id]
    });

    // Populate admin details
    await group.populate('admin', 'name email');

    console.log('✅ Chit group created successfully:', { 
      groupId: group._id, 
      name: group.name, 
      admin: req.user.id,
      monthlyAmount: group.monthlyAmount,
      totalSlots: group.totalSlots
    });

    res.status(201).json({
      success: true,
      message: 'Chit group created successfully',
      data: {
        group: {
          id: group._id,
          name: group.name,
          description: group.description,
          location: group.location,
          monthlyAmount: group.monthlyAmount,
          totalSlots: group.totalSlots,
          availableSlots: group.availableSlots,
          totalValue: group.totalValue,
          admin: group.admin,
          members: group.members,
          isActive: group.isActive,
          isStarted: group.isStarted,
          createdAt: group.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Create chit group error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during group creation'
    });
  }
};

// @desc    Join a chit group (direct join - deprecated in favor of requestJoin)
// @route   POST /api/group/join/:groupId
// @access  Private
const joinGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Find the group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Check if group is active
    if (!group.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This group is not active'
      });
    }

    // Check if group is full
    if (group.members.length >= group.totalSlots) {
      return res.status(400).json({
        success: false,
        message: 'Group is full. No more slots available.'
      });
    }

    // Check if user is already a member
    if (group.members.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this group'
      });
    }

    // Instead of direct join, create a pending join request if not exists
    const alreadyRequested = group.joinRequests?.some(r => r.user?.toString() === req.user.id && r.status === 'pending');
    if (alreadyRequested) {
      return res.status(400).json({
        success: false,
        message: 'Join request is already pending approval'
      });
    }

    group.joinRequests = group.joinRequests || [];
    group.joinRequests.push({ user: req.user.id, status: 'pending', requestedAt: new Date() });
    await group.save();

    // Populate member details
    await group.populate('members', 'name email');
    await group.populate('admin', 'name email');

    console.log('✅ User joined group:', { 
      userId: req.user.id, 
      groupId: group._id, 
      groupName: group.name,
      currentMembers: group.members.length,
      totalSlots: group.totalSlots
    });

    res.status(200).json({
      success: true,
      message: 'Join request submitted. Awaiting admin approval.',
      data: { groupId: group._id }
    });
  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating join request'
    });
  }
};

// @desc    Get all groups for a user
// @route   GET /api/group/my-groups
// @access  Private
const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      $or: [
        { admin: req.user.id },
        { members: req.user.id }
      ]
    }).populate('admin', 'name email')
      .populate('members', 'name email');

    res.status(200).json({
      success: true,
      data: {
        groups: groups.map(group => ({
          id: group._id,
          name: group.name,
          description: group.description,
          location: group.location,
          monthlyAmount: group.monthlyAmount,
          totalSlots: group.totalSlots,
          availableSlots: group.availableSlots,
          totalValue: group.totalValue,
          admin: group.admin,
          memberCount: group.members.length,
          isActive: group.isActive,
          isStarted: group.isStarted,
          currentSlot: group.currentSlot,
          createdAt: group.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Get my groups error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching groups'
    });
  }
};

// @desc    Get all available groups to join
// @route   GET /api/group/available
// @access  Private
const getAvailableGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      isActive: true,
      members: { $ne: req.user.id }, // Not already a member
      $expr: { $lt: [{ $size: "$members" }, "$totalSlots"] } // Has available slots
    }).populate('admin', 'name email')
      .populate('members', 'name email');

    res.status(200).json({
      success: true,
      data: {
        groups: groups.map(group => ({
          id: group._id,
          name: group.name,
          description: group.description,
          location: group.location,
          monthlyAmount: group.monthlyAmount,
          totalSlots: group.totalSlots,
          availableSlots: group.availableSlots,
          totalValue: group.totalValue,
          admin: group.admin,
          memberCount: group.members.length,
          isActive: group.isActive,
          isStarted: group.isStarted,
          createdAt: group.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Get available groups error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching available groups'
    });
  }
};

// @desc    Get group details by ID
// @route   GET /api/group/:groupId
// @access  Private
const getGroupDetails = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Find the group and populate admin and members
    const group = await Group.findById(groupId)
      .populate('admin', 'name email')
      .populate('members', 'name email');

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Check if user is a member or admin of the group
    const isMember = group.members.some(member => member._id.toString() === req.user.id);
    const isAdmin = group.admin._id.toString() === req.user.id;

    if (!isMember && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not a member of this group.'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        group: {
          id: group._id,
          name: group.name,
          description: group.description,
          location: group.location,
          monthlyAmount: group.monthlyAmount,
          totalSlots: group.totalSlots,
          availableSlots: group.availableSlots,
          totalValue: group.totalValue,
          admin: group.admin,
          members: group.members,
          memberCount: group.members.length,
          isActive: group.isActive,
          isStarted: group.isStarted,
          currentSlot: group.currentSlot,
          createdAt: group.createdAt,
          isUserAdmin: isAdmin,
          isUserMember: isMember
        }
      }
    });
  } catch (error) {
    console.error('Get group details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching group details'
    });
  }
};

module.exports = {
  createGroup,
  joinGroup,
  requestJoin,
  handleJoinRequest,
  getPendingJoinRequests,
  getMyGroups,
  getAvailableGroups,
  getGroupDetails
}; 