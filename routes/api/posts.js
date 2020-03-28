const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');

// @route POST api/posts
// @desc Create a post
// @access Private
router.post(
  '/',
  [
    auth,
    [
      check('text', 'Text is required!')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // because expect from text everything will come from database
      const user = await User.findById(req.user.id).select('-password');
      const newPost = new Post({
        text: req.body.text,
        user: req.user.id,
        name: user.name,
        avatar: user.avatar
      });
      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error!');
    }
  }
);

// @route GET api/posts
// @desc GET all posts
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error!');
  }
});

// @route GET api/post/:id
// @desc GET post by id
// @access Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // Check is there is a post with that id
    if (!post) {
      return res.status(404).json({ msg: 'Post not found!' });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    // If not a valid id
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found!' });
    }
    res.status(500).send('Server error!');
  }
});

// @route DELETE api/posts/:id
// @desc Delete a post
// @access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // If no post found
    if (!post) {
      return res.status(404).json({ msg: 'Post not found!' });
    }
    // Check if user owns that post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({
        msg: 'User not autherized to this post, it belogs to another user!'
      });
    }

    await post.remove();
    res.json({ msg: 'Post removed!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error!');
  }
});

module.exports = router;
