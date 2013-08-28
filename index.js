var request = require('request').defaults({jar: true})
  , cheerio = require('cheerio')
    
var LOGIN_URL = 'https://weightbot.com/account/login'
  , EXPORT_URL = 'https://weightbot.com/export'
  , TOKEN_FIELDNAME = '[name="authenticity_token"]'


exports.getData = function (email, password, callback) {

  request.get(LOGIN_URL, function (err, res, body) {

    if (err) return callback(err)
    if (res.statusCode !== 200) return callback(mkerr(res.statusCode))

    var token = ''
    , $ = cheerio.load(body)
    , tokenFields = $(TOKEN_FIELDNAME)

    if (tokenFields.length) token = tokenFields[0].attribs.value
    if (!token) return callback(mkerr(0))

    login(email, password, token, callback)
  })
}

function login (email, password, token, callback) {

  var formData = {
      email: email
    , password: password
    , authenticity_token: token
 }
 
 request.post(LOGIN_URL, {form: formData}, function(err, res, body) {

   if (err) return callback(err)
   // they send a 302 when the login is successful
   if (res.statusCode == 302) return download(callback)
   // and a 200 when its not - to show the wrong info page
   if (res.statusCode == 200) return callback(mkerr(1))
   // something else went wrong
   callback(mkerr(res.statusCode), body)
  })
}

function download (callback) {

  request.get(EXPORT_URL, function (err, res, body) {

    if (err) return callback(err)
    if (res.statusCode !== 200) return callback(mkerr(res.statusCode))

    callback(null, body)
  })
}

// just a helper function to clean up the code
function mkerr (code) {
 
  switch (code) {

  case 0:
    return new Error('Unable to get authentication token')
    break;

  case 1:
    return new Error('Wrong username or password')
    break;
  
  default:
    return new Error('HTTP Error: ' + code)
    break;
  }
}
