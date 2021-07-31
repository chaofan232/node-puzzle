const assert = require('assert');

describe('reader', () =>
  describe('countryIpCounter()', () =>
    it('should be memory efficient', function (done) {
      const heapUsageBefore = process.memoryUsage().heapUsed;
      const reader = require('../lib/index');
      return reader.countryIpCounter('RU', function (err, result) {
        if (err) {
          return done(err);
        }

        assert.strictEqual(result, 139092612);

        const heapUsageAfter = process.memoryUsage().heapUsed;
        const heapUsageIncrease = heapUsageAfter / heapUsageBefore;
        assert(
          heapUsageIncrease < 4,
          'Your heap memory usage increased more than 4 times'
        );

        return done();
      });
    })));
