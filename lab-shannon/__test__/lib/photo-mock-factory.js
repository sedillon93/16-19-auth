'use strict';

const faker = require(`faker`);
const accountMockFactory = require(`./account-mock-factory`);
const Photo = require(`../../model/photo`);

const photoMockFactory = module.exports = {};

photoMockFactory.create = () => {
  let mock = {};

  return accountMockFactory.create()
    .then(accountMock => {
      mock.account = accountMock;
      return new Photo({
        title: faker.lorem.word(3),
        people: faker.lorem.words(5).split(' '),
        account: accountMock.account._id,
        url: faker.random.url(),
      }).save();
    })
    .then(photo => {
      mock.photo = photo;
      return mock;
    });
};

photoMockFactory.remove = () => {
  return Promise.all([
    accountMockFactory.remove(),
    Photo.remove({}),
  ]);
};
