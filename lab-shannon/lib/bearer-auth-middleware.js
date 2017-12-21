'use strict';

const httpErrors = require(`http-errors`);
const jsonWebToken = require(`jsonwebtoken`);
// because we'll need to send the user's token proving we are who we say we are, we'll need to import the account.js file (where we are creating the account/getting a token)
const Account = require(`../model/account`);

const promisify = (fn) => (...args) => {
  return new Promise((resolve, reject) => {
    fn(...args, (error, data) => {
      if(error){
        return reject(error);
      }
      resolve(data);
    });
  });
};

module.exports = (request, response, next) => {
  if(!request.headers.authorization){   // since we are sending the token in the request header under a type 'authorization', we know it's a bad request if there's no such header
    return next(new httpErrors(400, `BAD REQUEST: authorization header is required`));
  }
  const token = request.headers.authorization.split('Bearer ')[1];    // the header format is a string in the form 'Bearer token' so if we split that and take the second element we grab the token
  if(!token){
    return next(new httpErrors(400, `BAD REQUEST: a token is required`));
  }
  return promisify(jsonWebToken.verify)(token, process.env.SECRET_THINGS)   // the jsonWebToken.verify is the 'function' argument passed in to promisify; 'token' and 'process.env.SECRET_THINGS' are the arguments passed as ...args
    .catch(error => Promise.reject(new httpErrors(401, error)))
    .then(decryptedData => {
      return Account.findOne({tokenSeed: decryptedData.tokenSeed});
    })
    .then(account => {
      if(!account){
        throw new httpErrors(404, `NOT FOUND`);
      }
      request.account = account;    // this will be passed off to the next middlware (jsonParser) so that we have access to the specific account we want
      return next();
    })
    .catch(next);
};
