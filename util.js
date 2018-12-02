let removeChar = function(str, pos, count = 1) {
  return str.slice(0, pos) + str.slice(pos + count);
};

let splitLines = function(str) {
  return str.split('\n');
};

module.exports = {
  removeChar,
  splitLines
};