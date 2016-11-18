/*
var unirest = require('unirest');
var access_token = require(process.cwd() + '/.credentials/beginkit.json').services.Buffer.AccessToken;
var async = require('async');

var profiles = 'https://api.bufferapp.com/1/profiles.json';

var entries = [
  ['facebook:plazmiq', '2016-09-04T20:22:12-04:00', '2016-09-05T08:35:12-04:00'],
  ['facebook:plazmiq', '2016-09-05T20:22:12-04:00', '2016-09-06T08:35:12-04:00'],
  ['facebook:plazmiq', '2016-09-10T20:22:12-04:00', '2016-09-12T08:35:12-04:00'],
  ['facebook:plazmiq', '2016-08-27T20:22:12-04:00', '2016-08-29T08:35:12-04:00'],
  ['facebook:plazmiq', '2016-07-27T06:22:12-04:00', '2016-07-27T08:35:12-04:00'],
  ['twitter:plazmiq', '2016-09-04T20:22:12-04:00', '2016-09-05T10:01:12-04:00'],
  ['twitter:plazmiq', '2016-09-05T20:22:12-04:00', '2016-09-06T21:08:12-04:00'],
  ['twitter:plazmiq', '2016-09-10T20:22:12-04:00', '2016-09-12T10:01:12-04:00'],
  ['twitter:plazmiq', '2016-08-27T20:22:12-04:00', '2016-08-29T10:01:12-04:00'],
  ['twitter:plazmiq', '2016-07-27T06:22:12-04:00', '2016-07-27T10:01:12-04:00'],
];


unirest.get(profiles)
  .query({
    access_token: access_token,
  })
  .end(function(response) {
    var profiles = response.body;
    async.map(entries, function(item, cb) {
      async.detect(profiles, function(profile, cb) {
        var comp = item[0].split(':');
        var service = comp[0].toLowerCase();
        var username = comp[1].toLowerCase();
        cb(profile.service.toLowerCase().indexOf(service) > -1 && profile.service_username.toLowerCase().indexOf(username) > -1);
      }, function(profile) {
        cb(null, {
          profile: profile.id,
          schedules: profile.schedules[0],
          suggested_date: moment(new Date(item[1])),
        });
      });
    }, function(error, entries) {
      async.reduce(entries, [], function(memo, profile, cb) {
        var wds = profile.schedules.days.map(function(_) {
          return weekdays.indexOf(_) + 1;
        });
        var dates = entries.map(function(_) {
          return _.suggested_date.clone();
        });
        var min_date = moment.min(dates);
        var max_date = moment.max(dates).add(1, 'week');
        var date_iter = min_date.clone();
        var dates_available = [];
        while (date_iter.isSameOrBefore(max_date)) {
          if (wds.indexOf(date_iter.isoWeekday()) >= 0) {
            for (var index = 0; index < profile.schedules.times.length; index++) {
              var time = profile.schedules.times[index].split(':');
              var new_date = date_iter.clone().hour(time[0]).minute(time[1]);
              dates_available.push(new_date);
            }
          }
          date_iter.add(1, 'day');
        }
        var calculated_date = moment.min(dates_available.filter(function(_) {
          return _.isSameOrAfter(profile.suggested_date);
        }));
        console.log(profile.suggested_date, calculated_date);
        console.log(profile.suggested_date.format('ddd, hA'), calculated_date.format('ddd, hA'));
        var data = {
          scheduled_at: calculated_date,
          media: {
            link: '...',
            picture: '...',
            title: '...',
            description: '...',
          },
          profile_ids: [profile.profile],
          text: 'Lorem Ipsum',
        };
        memo.push(data);
        cb(null, memo);
      }, function(error, ranges) {
        console.log(ranges);
      });

    });
  });
  */
var moment = require('moment');

var weekdays = [
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
  'sun',
];

module.exports = (function() {
  return {
    first: function(schedule, requested) {
      var wds = schedule[0].days.map(function(_) {
        return weekdays.indexOf(_) + 1;
      });
      var is_moment = moment.isMoment(requested);
      var min_date = is_moment ? requested : moment(requested);
      var max_date = min_date.clone().add(1, 'week');
      var date_iter = min_date.clone();
      var dates_available = [];
      while (date_iter.isSameOrBefore(max_date)) {
        if (wds.indexOf(date_iter.isoWeekday()) >= 0) {
          for (var index = 0; index < schedule[0].times.length; index++) {
            var time = schedule[0].times[index].split(':');
            var new_date = date_iter.clone().hour(time[0]).minute(time[1]);
            dates_available.push(new_date);
          }
        }
        date_iter.add(1, 'day');
      }
      var calculated_date = moment.min(dates_available.filter(function(_) {
        return _.isSameOrAfter(min_date);
      }));
      return is_moment ? calculated_date : calculated_date.toDate();
    },
  };
})();