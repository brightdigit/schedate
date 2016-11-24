var rome = require('rome');
var moment = require('moment-timezone');
var schedate = require('schedate');

function ready(fn) {
  if (document.readyState != 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(function() {
  // Your page initialization code here
  // the DOM will be available here
  var requestedDatetimeInput = document.getElementById('requested-datetime');
  rome(requestedDatetimeInput, {
    initialValue: new Date(),
  });

  var resultDatetime = document.getElementById('result-datetime');

  var calculateButton = document.getElementById('calculate-button');
  calculateButton.addEventListener('click', function() {
    var days = Array.prototype.slice.call(document.querySelectorAll('[name=days]:checked')).map(function(element, index) {
      return element.value;
    });
    var times = Array.prototype.slice.call(document.querySelectorAll('[name=times]:checked')).map(function(element, index) {
      return element.value;
    });
    var schedule = {
      days: days,
      times: times,
      timezone: moment.tz.guess(),
    };
    var result = schedate.first([schedule], moment(requestedDatetimeInput.value));
    resultDatetime.value = result;
  });
});