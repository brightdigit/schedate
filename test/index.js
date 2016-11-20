var profiles = require(__dirname + '/profiles.json');
var schedate = require('../lib');
var assert = require('assert');
var moment = require('moment');

describe('schedate', function() {
  var rows = [
    ['should return the morning next day', [
      ['5712dfe79b2f40a753e5f37f', '2016-09-04T20:22:12-04:00', '2016-09-05T09:35:12-04:00'],
      ['5712dfe79b2f40a753e5f37f', '2016-09-05T19:22:12-05:00', '2016-09-06T08:35:12-05:00'],
      ['5712df7f9b2f40b657e5f37c', '2016-09-04T18:22:12-06:00', '2016-09-05T09:01:12-06:00'],
      ['5712df7f9b2f40b657e5f37c', '2016-09-05T17:22:12-07:00', '2016-09-05T19:08:12-07:00'],
      ['5712dfe79b2f40a753e5f37f', '2016-09-04T20:22:12-04:00', '2016-09-05T09:35:12-04:00'],
      ['5712dfe79b2f40a753e5f37f', '2016-09-05T20:22:12-04:00', '2016-09-06T09:35:12-04:00'],
      ['5712df7f9b2f40b657e5f37c', '2016-09-04T20:22:12-04:00', '2016-09-05T11:01:12-04:00'],
      ['5712df7f9b2f40b657e5f37c', '2016-09-05T20:22:12-04:00', '2016-09-05T22:08:12-04:00'],
    ], ],
    ['should return the morning next weekday', [
      ['5712dfe79b2f40a753e5f37f', '2016-09-10T20:22:12-04:00', '2016-09-12T09:35:12-04:00'],
    ], ],
    ['should return the morning next weekday', [
      ['5712dfe79b2f40a753e5f37f', '2016-09-10T20:22:12-04:00', '2016-09-12T09:35:12-04:00'],
      ['5712dfe79b2f40a753e5f37f', '2016-08-27T20:22:12-04:00', '2016-08-29T09:35:12-04:00'],
      ['5712df7f9b2f40b657e5f37c', '2016-09-10T20:22:12-04:00', '2016-09-12T11:01:12-04:00'],
      ['5712df7f9b2f40b657e5f37c', '2016-08-27T20:22:12-04:00', '2016-08-29T11:01:12-04:00'],
    ], ],
    ['should return the morning today', [
      ['5712dfe79b2f40a753e5f37f', '2016-07-27T06:22:12-04:00', '2016-07-27T09:35:12-04:00'],
      ['5712df7f9b2f40b657e5f37c', '2016-07-27T06:22:12-04:00', '2016-07-27T11:01:12-04:00'],
    ], ],
  ];

  rows.forEach(function(set) {
    var desc = set[0];
    set[1].forEach(function(row, i) {
      it(desc + ' ' + row[2], function() {
        var expected = new Date(row[2]);
        var actual = schedate.first(profiles[row[0]], row[1]);
        assert.deepEqual(expected, actual);
      });

      it(desc + ' ' + row[2] + ' as moment', function() {
        var expected = moment(new Date(row[2]));
        var actual = schedate.first(profiles[row[0]], moment(new Date(row[1])));
        assert(expected.isSame(actual));
      });
    });
  });
});