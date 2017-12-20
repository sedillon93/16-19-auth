'use strict';

const mongoose = require(`mongoose`);
const crypto = require(`crypto`);
const bcrypt = require(`bcrypt`);
const jsonWebToken = require(`jsonwebtoken`);
const httpErrors = require(`http-errors`);

const accountSchema = mongoose.Schema({
  passwordHash: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username : {
    type: String,
    required: true,
    unique: true,
  },
  tokenSeed: {
    type: String,
    required: true,
    unique: true,
  },
  created: {
    type: Date,
    default: () => new Date(),
  },
});

accountSchema.methods.verifyPassword = function(password){
  return bcrypt.compare(password, this.passwordHash)
    .then(response => {
      if(!response)
        throw new httpErrors(401, `Authentication error: incorrect username or password`);

      return this;
    });
};

accountSchema.methods.createToken = function(){
  this.tokenSeed = crypto.randomBytes(64).toString('hex');

  return this.save()
    .then(account => {
      return jsonWebToken.sign({
        tokenSeed: account.tokenSeed,
      }, process.env.SECRET_THINGS);   // what does this line do? (the .sign functionality)
    });
};

const Account = module.exports = mongoose.model(`account`, accountSchema);

Account.create = (username, email, password) => {
  const HASH_SALT_ROUNDS = 8;
  return bcrypt.hash(password, HASH_SALT_ROUNDS)
    .then(passwordHash => {
      let tokenSeed = crypto.randomBytes(64).toString('hex');
      return new Account({  // the lines below are from ES6; they create a key by the name of the value and assign the value of that variable to the key that was just made. So 'username' is like {username: the value of the username variable}
        username,
        email,
        passwordHash,
        tokenSeed,
      }).save();
    });
};
