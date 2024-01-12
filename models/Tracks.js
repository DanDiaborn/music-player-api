const mongoose = require("mongoose");
const { Schema } = mongoose;

const TracksSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Set title']
  },
  author: {
    type: String,
    required: [true, 'Set author']
  },
  cover: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /\.jpg$/.test(value);
      },
      // message: props => `${props.value} should be jpg format.`
      message: props => `Cover should be in jpg format.`

    }
  },
  song: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /\.mp3$/.test(value);
      },
      // message: props => `${props.value} should be mp3 format.`
      message: props => `Song should be in mp3 format.`

    }
  }
});

module.exports = mongoose.model('Tracks', TracksSchema);
