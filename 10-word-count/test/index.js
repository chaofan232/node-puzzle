/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const assert = require('assert');
const WordCount = require('../lib');

const helper = function (input, expected, done) {
  let pass = false;
  const counter = new WordCount();

  counter.on('readable', function () {
    let result;
    if (!(result = this.read())) {
      return;
    }
    assert.deepStrictEqual(result, expected);
    assert(!pass, 'Are you sure everything works as expected?');
    return (pass = true);
  });

  counter.on('end', function () {
    if (pass) {
      return done();
    }
    return done(new Error('Looks like transform fn does not work'));
  });

  counter.write(input);
  return counter.end();
};

describe('10-word-count', function () {
  it('should count a single word', function (done) {
    const input = 'test';
    const expected = {words: 1, lines: 1};
    return helper(input, expected, done);
  });

  it('should count words in a phrase', function (done) {
    const input = 'this is a basic test';
    const expected = {words: 5, lines: 1};
    return helper(input, expected, done);
  });

  return it('should count quoted characters as a single word', function (done) {
    const input = '"this is one word!"';
    const expected = {words: 1, lines: 1};
    return helper(input, expected, done);
  });
});

// !!!!!
// Make the above tests pass and add more tests!
// !!!!!
