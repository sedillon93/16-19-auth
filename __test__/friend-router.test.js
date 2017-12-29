'use strict';

require(`./lib/setup`);
const superagent = require(`superagent`);
const server = require(`../lib/server`);
const accountMockFactory = require(`./lib/account-mock-factory`);
const friendMockFactory = require(`./lib/friend-mock-factory`);

const apiURL = `http://localhost:${process.env.PORT}/friends`;

describe(`FRIEND-AUTH`, () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(friendMockFactory.remove);

  describe(`POST /friends`, () => {
    test(`POST should respond with a 200 status and a friend if there are no errors`, () => {
      let accountMock = null;

      return accountMockFactory.create()
        .then(mock => {
          accountMock = mock;
          return superagent.post(`${apiURL}`)
            .set('Authorization', `Bearer ${accountMock.token}`)
            .send({
              firstName: 'Sarah',
              age: 22,
              occupation: 'nurse',
              favoriteThings: [`Skiing`, `Reading`, `Theatre`],
            })
            .then(response => {
              expect(response.status).toEqual(200);
              expect(response.body.account).toEqual(accountMock.account._id.toString());
              expect(response.body.age).toEqual(22);
              expect(response.body.occupation).toEqual('nurse');
            });
        });
    });

    test(`POST should respond with a 400 status if there is a bad request (no authorization header)`, () => {
      return superagent.post(`${apiURL}`)
        .send({
          firstName: 'Sarah',
          age: 22,
          occupation: 'nurse',
          favoriteThings: [`Skiing`, `Reading`, `Theatre`],
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test(`POST should respond with a 401 status if there is a problem with the token (missing or incorrect)`, () => {
      return superagent.post(`${apiURL}`)
        .set(`Authorization`, `Bearer notAToken`)
        .send({
          firstName: 'Sarah',
          age: 22,
          occupation: 'nurse',
          favoriteThings: [`Skiing`, `Reading`, `Theatre`],
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(401);
        });
    });

    describe(`GET /friends/:id`, () => {
      test(`GET should respond with a 200 status if there are no errors`, () => {
        let tempMock = null;
        return friendMockFactory.create()
          .then(mock => {
            tempMock = mock;
            return superagent.get(`${apiURL}/${tempMock.friend._id}`)
              .set('Authorization', `Bearer ${tempMock.account.token}`);
          })
          .then(response => {
            expect(response.status).toEqual(200);
            expect(response.body.firstName).toEqual(`${tempMock.friend.firstName}`);
          });
      });
      test(`GET should respond with a 404 status if the id is incorrect`, () => {
        let tempMock = null;
        return friendMockFactory.create()
          .then(mock => {
            tempMock = mock;
            return superagent.get(`${apiURL}/notAnId`)
              .set('Authorization', `Bearer ${tempMock.account.token}`);
          })
          .then(Promise.reject)
          .catch(response => {
            expect(response.status).toEqual(404);
          });
      });
      test(`GET should respond with a 401 status if there is a problem with the token (incorrect or missing)`, () => {
        let tempMock = null;
        return friendMockFactory.create()
          .then(mock => {
            tempMock = mock;
            return superagent.get(`${apiURL}/${tempMock.friend._id}`)
              .set(`Authorization`, `Bearer badToken`);
          })
          .then(Promise.reject)
          .catch(response => {
            expect(response.status).toEqual(401);
          });
      });
    });
  });
});
