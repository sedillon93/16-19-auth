'use strict';

const httpErrors = require(`http-errors`);
const Account = require(`../model/account`);

module.exports = (request, response, next) => {
  if(!request.headers.authorization){
    return next(new httpErrors(400, `BAD REQUEST: authorization header is required`));
  }
  
}
