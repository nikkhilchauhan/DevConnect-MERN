require('dotenv').config();
const express = require('express');
const router = express.Router();
const request = require('request');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');

// @Note: write inside tryCatch if you are talking to database/server

// @route GET api/profile/me
// @desc Get current user profile by authToken
// @access Private
router.get('/me', auth, async (req, res) => {
  try {
    // @Note: 'populate' is used to get element from another database
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res
        .status(400)
        .json({ msg: 'There is no profile for this user!' });
    }
    res.json(profile);
  } catch (err) {
    Console.error(err.message);
    res.status(500).send('Server error!');
  }
});

// @route POST api/profile
// @desc Create or update user profile
// @access Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required!').not().isEmpty(),
      check('skills', 'Skills is required!').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Build Profile object
    const profileFields = {};

    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    // Skills - Spilt into array
    if (req.body.skills) {
      profileFields.skills = req.body.skills
        .split(',')
        .map((skill) => skill.trim());
    }

    // if (typeof req.body.skills !== 'undefined') {
    //   profileFields.skills = req.body.skills.split(',');
    // }

    // Build Social object from profileFields object
    profileFields.social = {};

    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      // If profile already exits then Update profile
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields }, // $set is used to update existing value on database
          { new: true }
        );
        return res.json(profile);
      }
      // If profile does't exits then Create profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error!');
    }
  }
);

// @route GET api/profile
// @desc Get all profiles
// @access Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error!');
  }
});

// @route GET api/profile/user/:user_id
// @desc Get profile by user ID
// @access Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!profile)
      return res.status(400).json({ msg: 'No profile for this user!' });
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    // @Note: Because if user_id is not a valid object id it says 'Server error'
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'No profile for this user!' });
    }
    res.status(500).send('Server error!');
  }
});

// @route DELETE api/profile
// @desc Delete profile, user & posts
// @access Private
router.delete('/', auth, async (req, res) => {
  try {
    // Remove posts
    await Post.deleteMany({ user: req.user.id });
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error!');
  }
});

// @route PUT api/profile/experience
// @desc Add profile experience
// @access Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required!').not().isEmpty(),
      check('company', 'Company is required!').not().isEmpty(),
      check('from', 'From-date is required!').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array(),
      });
    }
    // newExp Object
    const newExp = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description,
    };
    try {
      // get profile by user id
      const profile = await Profile.findOne({ user: req.user.id });
      // unshift adds newExp to the begnning
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error!');
    }
  }
);

// @route DELETE api/profile/experience/:exp_id
// @desc Delete a experience from profile
// @access Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    // get profile by user id
    const profile = await Profile.findOne({ user: req.user.id });
    // Get remove index
    const removeIndex = profile.experience
      .map((item) => {
        item.id;
      })
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error!');
  }
});

// @route PUT api/profile/education
// @desc Add profile education
// @access Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required!').not().isEmpty(),
      check('degree', 'Degree is required!').not().isEmpty(),
      check('fieldofstudy', 'Field-of-study is required!').not().isEmpty(),
      check('from', 'From-date is required!').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array(),
      });
    }
    // Object
    const newEdu = {
      school: req.body.school,
      degree: req.body.degree,
      fieldofstudy: req.body.fieldofstudy,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description,
    };
    try {
      // get profile by user id
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error!');
    }
  }
);

// @route DELETE api/profile/education/:edu_id
// @desc Delete a education from profile
// @access Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    // get profile by user id
    const profile = await Profile.findOne({ user: req.user.id });
    // Get remove index
    const removeIndex = profile.education
      .map((item) => {
        item.id;
      })
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error!');
  }
});

// @route GET api/profile/github/:username
// @desc Get user repos from Github
// @access Public
router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${process.env.GITHUBCLIENTID}&client_secret=${process.env.GITHUBSECRET}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };
    request(options, (error, response, body) => {
      if (error) {
        console.error(errr);
      }
      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No github profile found!' });
      }
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error!');
  }
});

module.exports = router;
