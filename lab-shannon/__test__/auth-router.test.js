'use strict';

require(`./lib/setup`);
const superagent = require(`superagent`);
const server = require(`../lib/server`);
const accountMockFactory = require(`./lib/account-mock-factory`);

const apiURL = `http://localhost:${process.env.PORT}`;

describe(`AUTH-ROUTER`, () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(accountMockFactory.remove);

  describe(`POST /signup`, () => {
    test(`Creating an account with POST request should return 200 status and a token if no errors are present`, () => {
      return superagent.post(`${apiURL}/signup`)
        .send({
          username: `blahblahblah`,
          email: `something@something.com`,
          password: `YouWillNeverGuess`,
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
        });
    });

    test(`POST should return a 400 status if the request was missing information`, () => {
      return superagent.post(`${apiURL}/signup`)
        .send({
          username: 'something',
          email: 'winteriscoming@gmail.com',
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test(`POST should return a 409 status if a request is made with a duplicate key`, () => {
      let user1;
      return accountMockFactory.create()
        .then(mock => {
          user1 = mock;
          return superagent.post(`${apiURL}/signup`)
            .send({username: user1.account.username, email: 'anotherthing@gmail.com', password: 'nothingToSeeHere'});
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(409);
        });
    });
  });

  describe(`GET /login`, () => {
    test(`GET for login route should return a 200 status and a token if there are no errors`, () => {
      return accountMockFactory.create()
        .then(mock => {
          return superagent.get(`${apiURL}/login`)
            .auth(mock.request.username, mock.request.password);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
        });
    });

    test(`400 GET test`, () => {});
    test(`401 GET test`, () => {});
  });
});
