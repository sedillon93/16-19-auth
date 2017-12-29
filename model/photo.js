'use strict';

const mongoose = require(`mongoose`);

const photoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
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
