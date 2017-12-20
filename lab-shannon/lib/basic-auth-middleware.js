'use strict';

const httpErrors = require(`http-errors`);
const Account = require(`../model/account`);

module.exports = (request, response, next) => {
  if(!request.headers.authorization){
    return next(new httpErrors(400, `BAD REQUEST: authorization header is required`));
  }
  let base64AuthHeader = request.headers.authorization.split('Basic ')[1];  // this gets us just the base64 encoded username & password from the string 'Basic skldfkjsdfhadkljsfhasjlfhg'
  if(!base64AuthHeader){
    return next(new httpErrors(400, `BAD REQUEST: basic authorization string required`));
  }
  let stringAuthHeader = new Buffer(base64AuthHeader, `base64`).toString();

  let [username, password] = stringAuthHeader.split(':')  // ES6 syntax to create two variables at the same time from the array resulting from the split;
  if(!username || !password){
    return next(new httpErrors(400, `BAD REQUEST: username and password are required`));
  }

  return Account.findOne({username})    // find an account where the username key has a value equal to the username value I'm passing in now
    .then(account => {
      if(!account){
        return next(new httpErrors(404, `NOT FOUND`));
      }
      return account.verifyPassword(password);
    })
    .then(account => {
      request.account = account;
      return next();
    })
    .catch(next);
}
