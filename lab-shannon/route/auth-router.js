'use strict';

const {Router} = require(`express`);
const httpErrors = require(`http-errors`);
const jsonParser = require(`body-parser`).json();
const Account = require(`../model/account`);

const authRouter = module.exports = new Router();

authRouter.post(`/signup`, (request, response, next) => {
  if(!request.body.username || !request.body.email || !request.body.password){
    throw new httpErrors(400, `Username, email, and password are required in order to create an account`);
  }


});
