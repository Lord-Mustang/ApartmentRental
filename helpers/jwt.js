const settings = require("../config/config.json");
const moment = require("moment");
const jwt = require("jwt-simple");

//
// Encode (van email naar token)
//
function encodeToken(email) {
  const playload = {
    exp: moment()
      .add(10, "days")
      .unix(),
    iat: moment().unix(),
    sub: email
  };
  return jwt.encode(playload, settings.secretkey);
}

//
// Decode (returns decoded token)
//
function decode(token) {
    const payload = jwt.decode(token, settings.secretkey);
    return payload
}

//
// Decode (van token naar username)
//
function decodeToken(token, cb) {
  try {
    const payload = jwt.decode(token, settings.secretkey);

    // Check if the token has expired
    if (moment().unix() > payload.exp) {
      cb(new Error("token_has_expired"));
    } else {
      cb(null, payload);
    }
  } catch (err) {
    cb(err, null);
  }
}

module.exports = {
  encodeToken,
  decodeToken,
  decode
};