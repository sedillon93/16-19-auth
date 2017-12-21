'use strict';

const {Router} = require(`express`);
const jsonParser = require(`body-parser`).json();
const httpErrors = require(`http-errors`);
const Friend = require(`../model/friend`);

// accessing the friend of a specific account, so need Bearer authorization so we know you're allowed to do this
const bearerAuthMiddleware = require(`../lib/bearer-auth-middleware`);

const friendRouter = module.exports = new Router();

// using bearerAuthMiddleware here as middleware; it's 'next' will pass on to the next middleware, which will continue down until we hit the callback
friendRouter.post(`/friends`, bearerAuthMiddleware, jsonParser, (request, response, next) => {
  if(!request.account){   // we should be getting an account back from bearerAuthMiddleware; if not, there's a problem
    return next(new httpErrors(404, `NOT FOUND`));
  }

  return new Friend({
    ...request.body,
    account: request.account._id,
  }).save()
    .then(friend => response.json(friend))
    .catch(next);
});

friendRouter.get(`/friends/:id`, bearerAuthMiddleware, (request, response, next) => {
  
})
