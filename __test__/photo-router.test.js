'use strict';

require(`./lib/setup`);
const superagent = require(`superagent`);
const server = require(`../lib/server`);
const accountMockFactory = require(`./lib/account-mock-factory`);
const photoMockFactory = require(`./lib/photo-mock-factory`);

const apiURL = `http://localhost:${process.env.PORT}/photos`;

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

    test(`POST should respond with a 400 status if there is no authorization header`, () => {
      return superagent.post(`${apiURL}`)
        .field(`title`, `friend photo`)
        .attach(`photo`, `${__dirname}/asset/bestfriends.jpg`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
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
      return photoMockFactory.create()
        .then(mock => {
          tempMock = mock;
          return superagent.get(`${apiURL}/${mock.photo._id}`)
            .set(`Authorization`, `Bearer ${tempMock.account.token}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
        });
    });

    test(`GET should respond with a 404 status if there is no authorization header`, () => {
      let tempMock = null;
      return photoMockFactory.create()
        .then(mock => {
          tempMock = mock;
          return superagent.get(`${apiURL}/`)
            .then(Promise.reject)
            .catch(response => {
              expect(response.status).toEqual(404);
            });
        });
    });

    test(`GET should respond with a 401 status if there is a problem with the token (missing or incorret)`, () => {
      let tempMock = null;
      return photoMockFactory.create()
        .then(mock => {
          tempMock = mock;
          return superagent.get(`${apiURL}/${tempMock.account._id}`)
            .set(`Authorization`, `Bearer thisIsABadToken`)
            .then(Promise.reject)
            .catch(response => {
              expect(response.status).toEqual(401);
            });
        });
    });
  });

  describe(`DELETE /photos/:id`, () => {
    test(`DELETE should respond with a 204 status if there are no errors`, () => {
      let tempMock = null;
      return photoMockFactory.create()
        .then(mock => {
          tempMock = mock;
          return superagent.delete(`${apiURL}/${tempMock.photo._id}`)
            .set(`Authorization`, `Bearer ${tempMock.account.token}`)
            .then(response => {
              expect(response.status).toEqual(204);
            });
        });
    });

    test(`DELETE should respond with a 404 status if the id is bad`, () => {
      let tempMock = null;
      return photoMockFactory.create()
        .then(mock => {
          tempMock = mock;
          return superagent.delete(`${apiURL}/badId`)
            .set(`Authorization`, `Bearer ${tempMock.account.token}`)
            .then(Promise.reject)
            .catch(response => {
              expect(response.status).toEqual(404);
            });
        });
    });

    test(`DELETE should respond with a 401 status if there was a problem with the token (missing or incorrect)`, () => {
      let tempMock = null;
      return photoMockFactory.create()
        .then(mock => {
          tempMock = mock;
          return superagent.delete(`${apiURL}/${tempMock.photo._id}`)
            .set(`Authorization`, `Bearer notAThing`)
            .then(Promise.reject)
            .catch(response => {
              expect(response.status).toEqual(401);
            });
        });
    });
  });
});
