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
  rome(document.getElementById('requested-datetime-calendar'), {
    initialValue: new Date(),
    inputFormat: 'dddd, MMMM Do YYYY, h:mm a',
  }).on('data', function(value) {
    requestedDatetimeInput.value = value;
  });
  requestedDatetimeInput.value = moment(new Date()).format('dddd, MMMM Do YYYY, h:mm a');

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
    var requedDateTime = moment(requestedDatetimeInput.value, 'dddd, MMMM Do YYYY, h:mm a');
    document.getElementsByTagName('code')[0].innerText = ['schedate.first(', JSON.stringify([schedule]), ', new Date("', requedDateTime.toDate(), '"));'].join('');
    var result = schedate.first([schedule], requedDateTime);
    resultDatetime.value = result.format('dddd, MMMM Do YYYY, h:mm a');
  });
});