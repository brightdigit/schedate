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
  var requestedDateTimeInput = document.getElementById('requested-datetime');
  rome(document.getElementById('requested-datetime-calendar'), {
    initialValue: new Date(),
    inputFormat: 'dddd, MMMM Do YYYY, h:mm a',
  }).on('data', function(value) {
    requestedDateTimeInput.value = value;
    calculate();
  });
  requestedDateTimeInput.value = moment(new Date()).format('dddd, MMMM Do YYYY, h:mm a');

  var resultDatetime = document.getElementById('result-datetime');

  var calculateButton = document.getElementById('calculate-button');

  Array.prototype.slice.call(document.getElementsByTagName('input')).forEach(function(element) {
    element.addEventListener('click', calculate);
  });

  function calculate() {
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
    var requedDateTime = moment(requestedDateTimeInput.value, 'dddd, MMMM Do YYYY, h:mm a');
    document.getElementsByTagName('code')[1].innerText = ['schedate.first(\n', JSON.stringify([schedule], null, 2), ',\nnew Date("', requedDateTime.toDate(), '")\n);'].join('');
    var result = schedate.first([schedule], requedDateTime);
    resultDatetime.value = result.format('dddd, MMMM Do YYYY, h:mm a');
  }


  calculate();
});