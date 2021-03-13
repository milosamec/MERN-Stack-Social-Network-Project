const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  // We want to create reference to the user model
  // Every profile should be associated to a user
  user: {
    // We connect it to the id in the user model
    type: mongoose.Schema.Types.ObjectId,
    // Reference to the model we're talking
    ref: 'user'
  },

  company: {
    type: String
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  // Developer/ senior dev/ junior dev/ instructor etc.. dropdown
  status: {
    type: String,
    required: true
  },
  // Array of string for skills - it's required. Comma separateed value list
  skills: {
    type: [String],
    required: true
  },
  bio: {
    type: String
  },
  githubusername: {
    type: String
  },
  experience: [
    {
      title: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      },
      location: {
        type: String
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  education: [
    {
      school: {
        type: String,
        required: true
      },
      degree: {
        type: String,
        required: true
      },
      fieldofstudy: {
        type: String,
        required: true
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('profile', ProfileSchema);
