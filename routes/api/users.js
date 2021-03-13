const express = require('express');
const normalize = require('normalize-url');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Make a request and send data - we can get it using req.body
    // We can destructure and pull out stuff
    const { name, email, password } = req.body;

    // Try catch - async function return promise
    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      // Get users gravatar

      const avatar = normalize(
        gravatar.url(email, {
          // Size of gravatar
          s: '200',
          // Rating
          r: 'pg',
          // Default Image (user icon)
          d: 'mm'
        })
      );

      // Create an instance of a User using the user var above and set it
      // to new user
      user = new User({
        name,
        email,
        avatar,
        password
      });

      // Encrypt the password using Bcrypt

      const salt = await bcrypt.genSalt(10);

      // We want to take the password and hash it
      user.password = await bcrypt.hash(password, salt);

      // Save user in DB - returns promise -  using async await
      await user.save();

      // Return jsonwebtoken in payload

      const payload = {
        user: {
          // With mongoose - we don't need _id
          id: user.id
        }
      };
      // We have to sign the (token) payload and add a secret inside of config json
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

      // res.send({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
