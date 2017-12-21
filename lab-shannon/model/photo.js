'use strict';

const mongoose = require(`mongoose`);

const photoSchema = mongoose.Schema({
  private: {
    type: Boolean,
    required: false,
    unique: false,
  },
  people: {
    type: [String],
    required: false,
    unique: false,
  },
  url: {
    type: String,
    required: true,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model('photo', photoSchema);
