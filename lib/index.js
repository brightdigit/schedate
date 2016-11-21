(function(root, factory) {
  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['moment-timezone'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require('moment-timezone'));
  } else {
    // Browser globals (root is window)
    root.schedate = factory(root.moment);
  }
}(this, function(moment) {
  //Use b in some fashion.

  var weekdays = [
    'mon',
    'tue',
    'wed',
    'thu',
    'fri',
    'sat',
    'sun',
  ];
  // Just return a value to define the module export.
  // This example returns an object, but the module
  // can return a function as the exported value.
  return {
    first: function(schedule, requested) {
      var wds = schedule[0].days.map(function(_) {
        return weekdays.indexOf(_) + 1;
      });
      var is_moment = moment.isMoment(requested);
      var min_date = (is_moment ? requested : moment(requested)).tz(schedule[0].timezone);
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
}));