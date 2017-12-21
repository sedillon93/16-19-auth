'use strict';

const superagent = require(`superagent`);
const accountMockFactory = require(`./lib/account-mock-factory`);
const friendMockFactory = require(`./lib/friend-mock-factory`);
const Account = require(`../model/account`);
const Friend = require(`../model/friend`);

describe(`FRIEND-AUTH`, () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(Friend.remove);

  describe(`POST /friends`, () => {
    test(`POST should respond with a 200 status and a friend if there are no errors`, () => {
      let mockAccount = null;
        return accountMockFactory.create()
          .then(account => {
            mockAccount = account;
            return superagent.post({
              firstName: 'Sarah',
              age: 22,
              occupation: nurse,
              favoriteThings: [`Skiing`, `Reading`, `Theatre`],
              account: mockAccount._id
            })
          })
          .then(response => {
            expect(response.status).toEqual(200);
            expect(response.body.age).toEqual(22);
            expect(response.body.occupation).toEqual('nurse');
          })
    });
    test(`400 request`, () => {});
    test(`401 request`, () => {});
  });

  describe(`POST /friends/:id`, () => {
    test(`200 request`, () => {});
    test(`404 request`, () => {});
    test(`401 request`, () => {});
  });
});
