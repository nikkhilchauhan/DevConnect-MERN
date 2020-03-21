const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { user } = require('../../controller/user');

// @route GET api/users
// @desc Register user
// @access Public
router.post(
  '/',
  [
    check('name', 'Name is requires!')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email address!').isEmail(),
    check(
      'password',
      'Please enter a password with or more characters!'
    ).isLength({ min: 6 })
  ],
  user
);

module.exports = router;
