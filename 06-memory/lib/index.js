const {createReadStream} = require('fs');
const readline = require('readline');

exports.countryIpCounter = (countryCode, cb) => {
  if (!countryCode) {
    return cb();
  }

  let counter = 0;

  const rs = createReadStream(`${__dirname}/../data/geo.txt`, {
    encoding: 'utf8',
  });

  const rl = readline.createInterface({
    input: rs,
    crlfDelay: Infinity,
  });

  rl.on('line', (line) => {
    if (line) {
      line = line.split('\t');
      line[3] === countryCode ? (counter += +line[1] - +line[0]) : counter;
    }
  });

  return rs.on('end', () => cb(null, counter));
};
