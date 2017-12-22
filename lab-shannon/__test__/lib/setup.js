'use strict';

const faker = require(`faker`);
const awsSDKMock = require(`aws-sdk-mock`);

process.env.PORT = 3000;
process.env.MONGODB_URI = `mongodb://localhost/testing`;
process.env.SECRET_THINGS = `gingersnaps`;

process.env.AWS_BUCKET = `farFarAway`;
process.env.AWS_ACCESS_KEY = `theMagicWord`;
process.env.AWS_SECRET_ACCESS_KEY = `happyPlace`;

// the awsSDKMock.mock functions just have this signature, that's why they have these arguments- what you're doing, what you're mocking, and what you're using to mock
awsSDKMock.mock(`S3`, `upload`, (params, callback) => {
  if(!params.Bucket || !params.Key || !params.ACL || !params.Body){
    return callback(new Error(`bucket, key, acl, and body are required`));
  }
  if(params.Bucket !== process.env.AWS_BUCKET){
    return callback(new Error(`_ERROR_ wrong bucket`));
  }
  if(params.ACL !== 'public-read'){
    return callback(new Error(`_ERROR_ ACL should be public-read`));
  }

  callback(null, {Location: faker.internet.url()});   // this is like the traditional (error, data) callback function
});

awsSDKMock.mock(`S3`, `deleteObject`, (params, callback) => {
  if(!params.Key || !params.Bucket){
    return callback(new Error(`_ERROR_ Key and Bucket are required`));
  }
  if(params.Bucket !== process.env.AWS_BUCKET){
    return callback(new Error(`_ERROR_ wrong Bucket`));
  }

  callback(null, {});
});
