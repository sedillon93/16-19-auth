'use strict';

const logger = require(`./logger`);
const mongoose = require(`mongoose`);
const express = require(`express`);

const app = express();
let serverIsOn = false;
let httpServer = null;

mongoose.Promise = Promise;

app.use(require(`./logger-middleware`));

app.use(require(`../route/auth-router`));
app.use(require(`../route/friend-router`));
app.use(require(`../route/photo-router`));

app.all(`*`, (request, response) => {
  logger.log(`info`, `Returning a 404 status from * route`);
  return response.sendStatus(404);
});

app.use(require(`./error-middleware`));

const server = module.exports = {};

server.start = () => {
  return new Promise((resolve, reject) => {
    if(serverIsOn){
      return reject(new Error(`__SERVER_ERROR__: The server is already on`));
    }
    httpServer = app.listen(process.env.PORT, () => {
      logger.log(`info`, `Server is listening on port ${process.env.PORT}`);
      console.log(`Server is listening on port: ${process.env.PORT}`);
      serverIsOn = true;
      return resolve();
    });
  })
    .then(mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true}));
};

server.stop = () => {
  return new Promise((resolve, reject) => {
    if(serverIsOn === false){
      logger.log(`info`, `__SERVER_ERROR__: The server is already off`);
      return reject(new Error(`__SERVER_ERROR__: The server is already off`));
    }
    if(httpServer === null){
      logger.log(`info`, `__SERVER_ERROR__: There is no server to turn off`);
      return reject(new Error(`__SERVER_ERROR__: There is no server to turn off`));
    }
    httpServer.close(() => {
      serverIsOn = false;
      httpServer = null;
      logger.log(`info`, `Turning the server off`);
      return resolve();
    });
  })
    .then(mongoose.disconnect());
};
