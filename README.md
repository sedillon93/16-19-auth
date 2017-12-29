## Purpose
The purpose of this application is to create an account, access the account using basic authorization, access other information as allowed using bearer authorization, and store, retrieve, and delete resources using AWS S3. It is deployed on Heroku and utilizes Travis CI for continuous integration.

## Set Up
* Run 'npm install' to install all dependencies
* Run 'npm i --save jest' to save jest for testing purposes
* Open a NEW tab in the terminal and run 'npm run dbon' to set up a server connection
* To test all functions run 'npm test'

## Routes
1. /signup
  * POST: To create an account make a POST request with the required information provided in your account object. You must include the username, email, and password (all Strings) in order to make an account. If information is missing a 400 status will occur. If the username, email, or password are already in use a 409 error will occur.
  * GET: To retrieve information about a particular account make a GET request with the username and password. If no account is found that matches the username/password combination a 404 error will occur. If an authorization header is not included in the request a 400 error will occur.

2. /friends
  * POST: To create a friend linked to an account make a POST request with an object containing the required friend information and a valid token in the request authorization header. You must include the friend's first name (a String), age (a Number), occupation (a String), and a list of their favorite things (and array of Strings).  If the account is verified by the token then a new friend will be created associated with the specified account. If no authorization header is present a 400 error will occur. If no account is found with a token matching that in the request a 404 error will occur.
  * GET: To retrieve information about a specific friend make a GET request with the friend's id included in the query params. If the account is verified by the token and the id provided matches a friend then that friend's information will be retrieved. If the id does not match any friends a 404 error will occur. If no authorization header is present a 400 error will occur. If no account is found with a token matching that in the request a 401 error will occur.

3. /photos
  * POST: To add an image file and store it make a POST request with the path to the image and an authorization header with a valid token. If an account is verified by the token then a new image will be uploaded and associated with the specified account.  If the token cannot be verified a 401 error will occur. If no authorization header is present a 400 error will occur.
  * GET: To retrieve a specific image file make a GET request with the image's id and an authorization header with a valid token. If the token is verified and the id provided matches an image then the image information will be retrieved. If there is no image which matches the id a 404 error will occur. If the token cannot be verified a 401 error will occur. If no authorization header is present a 400 error will occur.
  * DELETE: To delete a specific image file make a DELETE request with the image's id and an authorization header with a valid token. If the token is verified and the id provided matches an image then the image will be deleted from the database and AWS S3 storage. If there is no image which matches the id a 404 error will occur. If the token cannot be verified a 401 error will occur. If no authorization header is present a 400 error will occur.

## Technologies Used
### For production:
* ES6
* Travis CI
* mLab
* Heroku
* node
* aws-sdk
* bcrypt
* body-parser
* dotenv
* express
* fs-extra
* http-errors
* jsonwebtoken
* mongoose
* multer

### For development:
* aws-sdk-mock
* eslint
* faker
* jest
* superagent
* winston

## License
MIT

## Credits
* Vinicio Vladimir Sanchez Trejo & the Code Fellows curriculum provided the base .eslintrc, .eslintignore, and .gitignore files.

* My fellow 401JS classmates and the instructional staff for help problem solving and debugging.
