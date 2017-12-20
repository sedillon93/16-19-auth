'use strict';

const {Router} = require(`express`);
const jsonParser = require(`body-parser`).json();
const httpErrors = require(`http-errors`);
const Friend = require(`../model/friend`);

// accessing the friend of a specific account, so need Bearer authorization so we know you're allowed to do this
const bearerAuthMiddleware = require(`../lib/bearer-auth-middleware`);

const friendRouter = module.exports = new Router();

// using bearerAuthMiddleware here as middleware; it's 'next' will pass on to the next middleware, which will continue down until we hit the callback
friendRouter.get(`/friends`, bearerAuthMiddleware, jsonParser, (request, response, next) => {
  
});
