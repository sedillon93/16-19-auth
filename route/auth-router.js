'use strict';

const {Router} = require(`express`);
const httpErrors = require(`http-errors`);
const jsonParser = require(`body-parser`).json();
const Account = require(`../model/account`);

const basicAuthMiddleware = require(`../lib/basic-auth-middleware`);

const authRouter = module.exports = new Router();

authRouter.post('/signup', jsonParser, (request, response, next) => {
  if(!request.body.username || !request.body.email || !request.body.password){
    throw new httpErrors(400, `Username, email, and password are required in order to create an account`);
  }

  Account.create(request.body.username, request.body.email, request.body.password)
    .then(user => user.createToken())
    .then(token => response.json({token}))
    .catch(next);
});

authRouter.get(`/login`, basicAuthMiddleware, (request, response, next) => {
  if(!request.account){
    return next(new httpErrors(404, `BAD REQUEST`));
  }

  return request.account.createToken()
    .then(token => response.json({token}))
    .catch(next);
});
