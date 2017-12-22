'use strict';

require(`./lib/setup`);
const superagent = require(`superagent`);
const server = require(`../lib/server`);
const accountMockFactory = require(`./lib/account-mock-factory`);
const photoMockFactory = require(`./lib/photo-mock-factory`);

const apiURL = `http://localhost:${process.env.PORT}/photos`

describe(`Photo router`, () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(photoMockFactory.remove);

  describe(`POST /photos`, () => {
    test(`POST should respond with a 200 status and a photo if there are no errors`, () => {
      let mockAccount = null;
      return accountMockFactory.create()
        .then(account => {
          mockAccount = account;
          return superagent.post(`${apiURL}`)
            .set(`Authorization`, `Bearer ${account.token}`)
            .field(`title`, `friend photo`)
            .attach(`photo`, `${__dirname}/asset/bestfriends.jpg`)
            .then(response => {
              expect(response.status).toEqual(200);
            });
        });
    });

    test(`POST should respond with a 400 status if there is a bad request`, () => {
      let mockAccount = null;
      return accountMockFactory.create()
        .then(account => {
          mockAccount = account;
          return superagent.post(`${apiURL}`)
            .field(`title`, `friend photo`)
            .attach(`photo`, `${__dirname}/asset/bestfriends.jpg`)
            .then(Promise.reject)
            .catch(response => {
              expect(response.status).toEqual(400);
            });
        });
    });

    test(`POST should respond with a 401 status if there is a problem with the token (missing or incorrect)`, () => {
      return superagent.post(`${apiURL}`)
        .set(`Authorization`, `Bearer notAToken`)
        .field(`title`, `friend photo`)
        .attach(`photo`, `${__dirname}/asset/bestfriends.jpg`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(401);
        });
    });
  });

  describe(`GET /photos/:id`, () => {
    test(`GET should respond with a 200 status and a photo if there are no errors`, () => {
      let tempMock = null;
      return accountMockFactory.create()
        .then(mock => {
          tempMock = mock;
          return superagent.get(`${apiURL}/${mock._id}`)
        })
    });
  });
});
