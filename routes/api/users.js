require('dotenv').config();
const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

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
  async (req, res) => {
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ erros: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // See if user exits
      let user = await User.findOne({ email: email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });
      // @Note: we only use 'new' keyword if only it's a actual collection in databse/new model
      //   Creating instance of user
      user = new User({
        name,
        email,
        password,
        avatar
      });
      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      // Return jsonwebtoken
      const payload = {
        user: {
          id: user._id
        }
      };
      //   @Note: jwt token has user.id in token, test it at www.jwt.to
      jwt.sign(
        payload,
        process.env.SECRET,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error!');
    }
  }
);

module.exports = router;
