'use strict';

const {Router} = require(`express`);
const httpErrors = require(`http-errors`);
const bearerAuthMiddleware = require(`../lib/bearer-auth-middleware`);
const Photo = require(`../model/photo`);

const s3 = require(`../lib/s3`);
const multer = require(`multer`);
const upload = multer({dest: `${__dirname}/../temp`});

const photoRouter = module.exports = new Router();

photoRouter.post(`/photos`, bearerAuthMiddleware, upload.any(), (request, response, next) => {  //.any() means multer will create an array of files and store it in request.files
  if(!request.account){
    return next(httpErrors(404, `NOT FOUND`));
  }
  if(!request.body.title || request.files[0].fieldname !== 'photo' || request.files.length > 1){
    return next(httpErrors(400, `BAD REQUEST`));
  }

  let file = request.files[0];
  let key = `${file.filename}.${file.originalname}`;   // remember, these 'file.' are referring to the file we are assigning as request.files[0]

  return s3.upload(file.path, key)
    .then(url => {  // remember that s3.upload returns you the file.Location
      return new Photo({
        title: request.body.title,
        people: request.body.people,
        account: request.account._id,
        url: url,
      }).save();
    })
    .then(photo => {
      return response.json(photo);
    })
    .catch(next);
});

photoRouter.get(`/photos/:id`, bearerAuthMiddleware, (request, response, next) => {
  if(!request.account){
    return next(new httpErrors(404, `404: No account found`));
  }

  return Photo.findById(request.params.id)
    .then(photo => {
      if(!photo){
        throw new httpErrors(404, `404: No photo found`);
      }

      return response.json(photo);
    })
    .catch(next);
});

photoRouter.delete(`/photos/:id`, bearerAuthMiddleware, (request, response, next) => {
  if(!request.account){
    return next(new httpErrors(404, `404: No account found`));
  }
  return Photo.findById(request.params.id)
    .then(photo => {
      let photoURL = photo.url.split('/');
      let key = photoURL[photoURL.length - 1];
      return s3.remove(key)
        .then(() => {
          return Photo.findByIdAndRemove(request.params.id)
            .then(photo => {
              if(!photo){
                throw new httpErrors(404, `404: No photo found`);
              }
              return response.sendStatus(204);
            });
        });
    })
    .catch(error => {
      return Photo.findByIdAndRemove(request.params.id)
        .then(Promise.reject)
        .catch(next);
    });
});
