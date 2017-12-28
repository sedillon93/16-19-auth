'use strict';

const logger = require('./logger');

module.exports = (error,request,response,next) => {
  //------------------------------------------------
  //                HTTP ERRORS
  //------------------------------------------------
  logger.log('info','__ERROR_MIDDLEWARE__');
  logger.log('info',error);

  if(error.status){
    logger.log('info',`Responding with a ${error.status} status and message: ${error.message}`);
    return response.sendStatus(error.status);
  }
  //------------------------------------------------
  //                MONGO ERRORS
  //------------------------------------------------
  let message = error.message.toLowerCase();

  if(message.includes('objectid failed')){
    logger.log('info','Responding with a 404 status code');
    return response.sendStatus(404);
  }

  if(message.includes('validation failed')){
    logger.log('info','Responding with a 400 status code');
    return response.sendStatus(400);
  }

  if(message.includes('duplicate key')){
    logger.log('info','responding with a 409 status code');
    return response.sendStatus(409);
  }

  if(message.includes('unauthorized')){
    logger.log('info','Responding with a 401 status code');
    return response.sendStatus(401);
  }

  logger.log('info','Responding with a 500 status code because shit broke');
  logger.log('info', `The error was ${error}`);
  return response.sendStatus(500);
};
