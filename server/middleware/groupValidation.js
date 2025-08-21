const { body } = require('express-validator');

// Validation rules for creating a chit group
const createGroupValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Group name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Group name must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot be more than 500 characters'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location cannot be more than 200 characters'),
  
  body('monthlyAmount')
    .notEmpty()
    .withMessage('Monthly amount is required')
    .isNumeric()
    .withMessage('Monthly amount must be a number')
    .isFloat({ min: 1000, max: 100000 })
    .withMessage('Monthly amount must be between ₹1,000 and ₹1,00,000'),
  
  body('totalSlots')
    .optional()
    .isNumeric()
    .withMessage('Total slots must be a number')
    .isInt({ min: 5, max: 50 })
    .withMessage('Total slots must be between 5 and 50')
];

module.exports = {
  createGroupValidation
}; 