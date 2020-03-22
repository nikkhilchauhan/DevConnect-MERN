const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');

const { auth } = require('../../middleware/auth');

// @route GET api/users
// @desc Test route
// @access Public
router.get('/', auth, async (req, res) => {
  try {
    // @Note: -password means it don't send back password
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    Console.error(err.message);
    res.status(500).send('Server error!');
  }
});

// @route POST api/auth
// @desc Authenticate user & get token
// @access Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email address!').isEmail(),
    check('password', 'Password is required!').exists()
  ],
  async (req, res) => {
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ erros: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // See if user exits
      let user = await User.findOne({ email: email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials!' }] });
      }
      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials!' }] });
      }
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
