const express = require('express');
const router = express.Router();
const { createGroup, joinGroup, requestJoin, handleJoinRequest, getPendingJoinRequests, getMyGroups, getAvailableGroups, getGroupDetails } = require('../controller/groupController');
const { createGroupValidation } = require('../middleware/groupValidation');
const { protect } = require('../config/jwt');

// @route   POST /api/group/create
// @desc    Create a new chit group
// @access  Private
router.post('/create', protect, createGroupValidation, createGroup);

// @route   POST /api/group/join/:groupId
// @desc    Join a chit group
// @access  Private
router.post('/join/:groupId', protect, joinGroup);

// @route   POST /api/group/request-join/:groupId
// @desc    Request to join a chit group (pending approval)
// @access  Private
router.post('/request-join/:groupId', protect, requestJoin);

// @route   GET /api/group/requests/:groupId
// @desc    Get pending join requests for a group (admin only)
// @access  Private
router.get('/requests/:groupId', protect, getPendingJoinRequests);

// @route   POST /api/group/requests/:groupId/:requestId
// @desc    Approve/Reject a join request (admin only)
// @access  Private
router.post('/requests/:groupId/:requestId', protect, handleJoinRequest);

// @route   GET /api/group/my-groups
// @desc    Get all groups for the current user
// @access  Private
router.get('/my-groups', protect, getMyGroups);

// @route   GET /api/group/available
// @desc    Get all available groups to join
// @access  Private
router.get('/available', protect, getAvailableGroups);

// @route   GET /api/group/:groupId
// @desc    Get group details by ID
// @access  Private
router.get('/:groupId', protect, getGroupDetails);

module.exports = router; 