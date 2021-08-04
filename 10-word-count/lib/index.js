const through2 = require('through2');

const isCamelCased = (str) => {
  const camelCasedPattern = new RegExp('([A-Z]+[a-z0-9]+){2,}');
  return camelCasedPattern.test(str);
};

const isQuotedStr = (str) => {
  const quotedStrPattern = new RegExp('"[^"]*"');
  return quotedStrPattern.test(str);
};

module.exports = function () {
  let words = 0;
  let lines = 0;
  let chars = 0;

  const transform = function (chunk, encoding, cb) {
    chars = chunk.replace(/\s/g, '').length;

    chunk.split('\n').forEach((line) => {
      if (!line) {
        return;
      }

      lines++;
      if (isQuotedStr(line)) {
        words += 1;
      } else {
        if (isCamelCased(line)) {
          line = line.split(/([A-Z][a-z]+)/).filter((word) => word);
          words += line.length;
          return;
        }
        line = line.split(' ');
        words += line.length;
      }
    });

    return cb();
  };

  const flush = function (cb) {
    this.push({words, lines, chars});
    this.push(null);
    return cb();
  };

  return through2.obj(transform, flush);
};
