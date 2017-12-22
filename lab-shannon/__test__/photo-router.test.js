'use strict';

const superagent = require(`superagent`);
const server = require(`../lib/server`);
const accountMockFactory = require(`./lib/account-mock-factory`);
const photoMockFactory = require(`./lib/photo-mock-factory`);

const apiUrl = `http://localhost:${process.env.PORt}`;

describe(`Photo router`, () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach();

  describe(`POST /photos`, () => {
    test(`POST should respond with a 200 status and a photo if there are no errors`, () => {
      let mockAccount = null;
      return accountMockFactory.create()
        .then(account => {
          mockAccount = account;
          return superagent.post(`${apiUrl}/photos`)
            .set(`Authorization`, `Bearer ${account.token}`)
            .field(`title`, `friend photo`)
            .attach(`photo`, `${__dirname}/asset/bestfriends.jpg`)
            .then(response => {
              expect(response.status).toEqual(200);
            });
        });
    });
  });
});
