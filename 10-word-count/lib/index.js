const through2 = require('through2');

const quotedStrPattern = new RegExp('"[^"]*"');
const camelCasedPattern = new RegExp('([A-Z]+[a-z0-9]+){2,}');

const isCamelCased = (str) => {
  return camelCasedPattern.test(str);
};

const isQuotedStr = (str) => {
  return quotedStrPattern.test(str);
};

module.exports = function () {
  let words = 0;
  let lines = 0;

  const transform = function (chunk, encoding, cb) {
    chunk.split('\n').forEach((line) => {
      //  Skip empty line
      if (line) {
        lines++;
        // Handle quoted strings:
        if (isQuotedStr(line)) {
          words += 1;
        } else {
          // Handle camel cased string without "": split the camel cased string into separate word
          if (isCamelCased(line)) {
            line = line.split(/([A-Z][a-z]+)/).filter((word) => word);
            words += line.length;
          } else {
            line = line.split(' ');
            words += line.length;
          }
        }
      }
    });

    return cb();
  };

  const flush = function (cb) {
    this.push({words, lines});
    this.push(null);
    return cb();
  };

  return through2.obj(transform, flush);
};

// Requirments:
// - Extend the transform stream to handle quoted strings.
// - Extend the transform stream to handle camel cased words.
// - Extend the transform stream to count lines.
// - Write more tests to demonstrate your skills finding edge cases and corner cases.
// - Bonus points: add support for counting characters and bytes.
