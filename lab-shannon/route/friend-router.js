'use strict';

const {Router} = require(`express`);
const jsonParser = require(`body-parser`).json();
const httpErrors = require(`http-errors`);
const Friend = require(`../model/friend`);

const friendRouter = module.exports = new Router();
