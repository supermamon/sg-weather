/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');
var Vibe = require('ui/vibe');

// Construct URL
var cityName = 'Singapore';
//var URL = 'http://api.openweathermap.org/data/2.5/find?q=' + cityName;
var URL = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityName;

var main = new UI.Card({
	title: 'SG Weather',
	//icon: 'images/info.png',
	subtitle: 'Fetching...',
	body: ''//,  scrollable:true
});

main.show();
refreshWeather();

function formatTime(utc) {
  var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
  d.setUTCSeconds(utc);
  var sTime = '';
  if (d.getHours() < 10) {sTime += '0'+d.getHours();}
  else {sTime += d.getHours();}
  sTime+=':';
  if (d.getMinutes() < 10) {sTime += '0'+d.getMinutes();}
  else {sTime += d.getMinutes();}
  
  return sTime;
}

function refreshWeather() {
	main.subtitle('Fetching...');
	main.body('');
	
	ajax(
		{
			url: URL,
			type: 'json'
		},
		function(data) {
			// Success!
			console.log('Successfully fetched weather data!');
      console.log(JSON.stringify(data));
      
      if (data.cod != 200) {
        main.subtitle('Failed.');
        main.body(data.message);
        return;
      }
      
			// Extract data
			//var location = data.name;

      //data = data.list[0];
      var summary = data.weather[0].description;
			// Always upper-case first letter of description
      summary = summary.charAt(0).toUpperCase() + summary.substring(1);
      
			var temperature = Math.round(data.main.temp - 273.15) + 'C';
      temperature += ' (' + Math.round(data.main.temp_min - 273.15) + '';
      temperature += '/'  + Math.round(data.main.temp_max - 273.15) + ')';
      
      var utcSeconds = data.sys.sunrise;
      var sunrise = new Date(0); // The 0 there is the key, which sets the date to the epoch
      sunrise.setUTCSeconds(utcSeconds);

      utcSeconds = data.sys.sunset;
      var sunset = new Date(0); // The 0 there is the key, which sets the date to the epoch
      sunset.setUTCSeconds(utcSeconds);
      
      var description = '';
      description += summary;
      description += '\nTemp: ' + temperature;
      description += '\nHumidity: '+data.main.humidity + ' %';
      description += '\nPressure: '+data.main.pressure+' hpa';
      description += "\nWind: "+data.wind.speed+'mph '+data.wind.deg+' deg';
      description += '\nSun: ' + formatTime(data.sys.sunrise) + ' / ' + formatTime(data.sys.sunset);
			
			// Show to user
			main.subtitle('');
			main.body(description);
      Vibe.vibrate('short');
		},
		function(error) {
			// Failure!
			console.log('Failed fetching weather data: ' + error);
			main.subtitle('Unavailable');
		}
	);

}

/* Events */
main.on('click', 'select', function(e) {
  refreshWeather();	
});
