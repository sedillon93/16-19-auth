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
    test()
  })
})
