/* eslint no-useless-escape: 0 */

module.exports.comeOnMongoReally = function(string) {
  if (string) {
    return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  }
};
