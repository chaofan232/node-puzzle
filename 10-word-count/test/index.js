const assert = require('assert');
const WordCount = require('../lib');
const fs = require('fs');

const file1 = `${__dirname}/fixtures/1,9,44.txt`;
const file2 = `${__dirname}/fixtures/3,7,46.txt`;
const file3 = `${__dirname}/fixtures/5,9,40.txt`;

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
    const expected = {words: 1, lines: 1, chars: 4};
    return helper(input, expected, done);
  });

  it('should count words in a phrase', function (done) {
    const input = 'this is a basic test';
    const expected = {words: 5, lines: 1, chars: 16};
    return helper(input, expected, done);
  });

  it('should count quoted characters as a single word', function (done) {
    const input = '"this is one word!"';
    const expected = {words: 1, lines: 1, chars: 16};
    return helper(input, expected, done);
  });
});

// !!!!!
// Make the above tests pass and add more tests!
// !!!!!

// Add test cases for counting camel cased strings:
describe('10-word-count: camel cased strings', function () {
  it('should count camel cased word as multiple words', function (done) {
    const input = 'AFunPuzzle';
    const expected = {words: 3, lines: 1, chars: 10};
    return helper(input, expected, done);
  });

  it('should count number in a  camel cased word as a word', function (done) {
    const input = 'The2FunPuzzle';
    const expected = {words: 4, lines: 1, chars: 13};
    return helper(input, expected, done);
  });

  it('should count camel cased abbreviations as one word', function (done) {
    const input = 'SetupSDKForMobileDev';
    const expected = {words: 5, lines: 1, chars: 20};
    return helper(input, expected, done);
  });
});

// Test fixtures folder's file data:
describe('10-word-count: fixtures files', function () {
  it('should count every word', function (done) {
    const input = fs.readFileSync(file1, 'utf8');
    const expected = {words: 9, lines: 1, chars: 35};
    return helper(input, expected, done);
  });

  it('should count quoted string as one word', function (done) {
    const input = fs.readFileSync(file2, 'utf8');
    const expected = {words: 7, lines: 3, chars: 37};
    return helper(input, expected, done);
  });

  it('should count camel cased string as multiple words', function (done) {
    const input = fs.readFileSync(file3, 'utf8');
    const expected = {words: 9, lines: 5, chars: 13, chars: 35};
    return helper(input, expected, done);
  });
});
