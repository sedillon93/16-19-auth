'use strict';

const faker = require(`faker`);
const accountMockFactory = require(`./account-mock-factory`);
const Friend = require(`../../model/friend`);

const friendMockFactory = module.exports = {};

friendMockFactory.create = () => {
  let resultMock = {};
  return accountMockFactory.create()
    .then(accountMock => {
      resultMock.account = accountMock;

      return new Friend({
        firstName: faker.name.firstName(),
        age: faker.random.number(),
        occupation: faker.name.jobTitle(),
        favoriteThings: faker.lorem.words(10).split(' '),
        account: accountMock.account._id,   // we can use accountMock here because we are still in scope with the response from accountMockFactory.create()
      }).save();
    })
    .then(friend => {
      resultMock.friend = friend;
      return resultMock;
    });
};

friendMockFactory.remove = () => {
  return Promise.all([
    accountMockFactory.remove(),
    Friend.remove({}),
  ]);
};
