const crypto = require("crypto");
const randomId = () => {
  return crypto.randomBytes(8).toString("hex")
};

const createGamecode = () => {
  // Declare all characters
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // Pick characers randomly
  var str = '';
  for (var i = 0; i < 4; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return str;
}

module.exports = {
  createGamecode,
  randomId
}