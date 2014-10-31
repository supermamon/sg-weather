/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');

// Construct URL
var cityName = 'Singapore';
var URL = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityName;


var main = new UI.Card({
	title: 'SG Weather',
	icon: 'images/info.png',
	subtitle: 'Fetching...',
	body: ':)'
});

main.show();
refreshWeather();

function refreshWeather() {
	main.subtitle('Fetching...');
	main.body(':)');
	
	ajax(
		{
			url: URL,
			type: 'json'
		},
		function(data) {
			// Success!
			console.log('Successfully fetched weather data!');

			// Extract data
			var location = data.name;
			var temperature = Math.round(data.main.temp - 273.15) + 'C';

			// Always upper-case first letter of description
			var description = data.weather[0].description;
			description = description.charAt(0).toUpperCase() + description.substring(1);
			
			// Show to user
			main.subtitle(temperature);
			main.body(description);
		},
		function(error) {
			// Failure!
			console.log('Failed fetching weather data: ' + error);
			main.subtitle('Unavailable');
		}
	);

}



/* Events */
main.on('click', 'up', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Pebble.js',
        icon: 'images/menu_icon.png',
        subtitle: 'Can do Menus'
      }, {
        title: 'Second Item',
        subtitle: 'Subtitle Text'
      }]
    }]
  });
  menu.on('select', 
  function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  //menu.show();
});

main.on('click', 'select', function(e) {
  refreshWeather();	
  /*
  var wind = new UI.Window();
  var textfield = new UI.Text({
    position: new Vector2(0, 50),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: 'Text Anywhere!',
    textAlign: 'center'
  });
  wind.add(textfield);
  wind.show();
  */
});

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});
