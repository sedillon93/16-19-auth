'use strict';

const {Router} = require(`express`);
const httpErrors = require(`http-errors`);
const bearerAuthMiddleware = require(`../lib/bearer-auth-middleware`);
const Photo = require(`../model/photo`);

const s3 = require(`../lib/s3`);
const multer = require(`multer`);
const upload = multer({dest: 'uploads/'});

const photoRouter = module.exports = new Router();

photoRouter.post(`/photos`, bearerAuthMiddleware, upload.any(), (request, response, next) => {  //.any() means multer will create an array of files and store it in request.files
  if(!request.account){
    return next(httpErrors(400, `BAD REQUEST`));
  }
  if(request.files.length > 1){}


  let file = request.files[0];
  let key = `${file.filename}.${file.originalname}`;   // remember, these 'file.' are referring to the file we are assigning as request.files[0]

  return s3.upload(file.path, key)
    .then(url => {    // remember that s3.upload returns you the file.Location
      return new Photo({
        private: request.body.private,
        people: request.body.people,
        account: request.account._id,
        url: url,
      }).save();
    })
    .then(photo => response.json(photo))
    .catch(next);
});

photoRouter.get(`/photos/:id`);

photoRouter.delete(`/photos/:id`);
