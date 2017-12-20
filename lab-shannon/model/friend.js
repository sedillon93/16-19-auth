'use strict';

const mongoose = require(`mongoose`);

const friendSchema = mongoose.Schema({
  firstName : {type: String},
  age : {type: Number},
  occupation : {type: String},
  favoriteThings : [{type: String}],

  account: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model(`friend`, friendSchema);
