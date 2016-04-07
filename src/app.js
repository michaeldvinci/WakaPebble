var UI = require('ui');
var ajax = require('ajax');
var itemsTod = [];
var itemsYes = [];
var itemsTwo = [];
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var options = {};
var api_key='';

var toHHMMSS = function (date) {
	var sec_num = parseInt(date, 10); // don't forget the second param
	var hours   = Math.floor(sec_num / 3600);
	var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	var seconds = sec_num - (hours * 3600) - (minutes * 60);

	if (hours   < 10) {hours   = "0"+hours;}
	if (minutes < 10) {minutes = "0"+minutes;}
	if (seconds < 10) {seconds = "0"+seconds;}
	var time    = hours+':'+minutes+':'+seconds;
	return time;
};

var today = new Date();
var today1 = [today.getMonth()+1,today.getDate(),today.getFullYear()].join('/');
var yesterday = [today.getMonth()+1,today.getDate()-1,today.getFullYear()].join('/');
var twoDaysAgo = [today.getMonth()+1,today.getDate()-2,today.getFullYear()].join('/');
var twoDays = days[ today.getDay() -2];

ajax(
	{
		url: 'https://wakatime.com/api/v1/users/current/durations?date='+twoDaysAgo+'&api_key='+api_key,
		type: 'json'
	}, 

	function(data){

		console.log("data", data.data, data.data.length);
		console.log("date: ", twoDaysAgo);

		if (data.data.length == 0) {
			console.log("No data for date "+twoDaysAgo);
			itemsTwo.push({
				title: 'No time logged',
				subtitle: 'Get to work!'
			});
		} else {
			for (var i = 0; i<data.data.length; i++) {
				itemsTwo.push({ 
					title: data.data[i].project, 
					subtitle: 'Time spent: '+toHHMMSS(data.data[i].duration.toString())
				});
			}
		}

		console.log("items", itemsTwo);

	},
	function(error) {
		// Failure!
		console.log('Failed fetching WakaTime data: ' + error);
	}
);

ajax(
	{
		url: 'https://wakatime.com/api/v1/users/current/durations?date='+yesterday+'&api_key='+api_key,
		type: 'json'
	}, 

	function(data){
		
		console.log("data", data.data, data.data.length);
		console.log("date: ", yesterday);

		if (data.data.length == 0) {
			console.log("No data for date "+yesterday);
			itemsYes.push({
				title: 'No time logged',
				subtitle: 'Get to work!'
			});
		} else {
			for (var i = 0; i<data.data.length; i++) {
				itemsYes.push({ 
					title: data.data[i].project, 
					subtitle: 'Time spent: '+toHHMMSS(data.data[i].duration.toString())
				});
			}
		}

		console.log("items", itemsYes);

	},
	function(error) {
		// Failure!
		console.log('Failed fetching WakaTime data: ' + error);
	}
);

ajax(
	{
		url: 'https://wakatime.com/api/v1/users/current/durations?date='+today1+'&api_key='+api_key,
		type: 'json'
	}, 

	function(data){
		
		console.log("data", data.data, data.data.length);
		console.log("date: ", today1);

		if (data.data.length == 0) {
			console.log("No data for date "+today1);
			itemsTod.push({
				title: 'No time logged',
				subtitle: 'Get to work!'
			});
		} else {
			for (var i = 0; i<data.data.length; i++) {
				itemsTod.push({ 
					title: data.data[i].project, 
               subtitle: 'Time spent: '+toHHMMSS(data.data[i].duration.toString())
				});
			}
		}

		console.log("items", itemsTod);

		checkAPI(api_key, itemsYes, itemsTod, itemsTwo) ;
	},
	function(error) {
		// Failure!
		console.log('Failed fetching WakaTime data: ' + error);
	}
);

Pebble.addEventListener('showConfiguration', function() {
  var url = 'http://michaeldvinci.github.io/WakaPebble';

  Pebble.openURL(url);
});


Pebble.addEventListener("webviewclosed", function(e) {

  var configData = JSON.parse(decodeURIComponent(e.response));
  console.log('Configuration page returned: ' + JSON.stringify(configData));

  api_key = configData.API;

  checkAPI(api_key, itemsYes, itemsTod, itemsTwo) ;

  console.log("configuration closed");
  // webview closed
  //Using primitive JSON validity and non-empty check
  if (e.response.charAt(0) == "{" && e.response.slice(-1) == "}" && e.response.length > 5) {
    options = JSON.parse(decodeURIComponent(e.response));
    console.log("Options = " + JSON.stringify(options));
  } else {
    console.log("Cancelled");
  }
});

function checkAPI(api_key, twoitemsYes, itemsTod, itemsTwo) {
   if (api_key !== '') {      
      var dailyProjects = new UI.Menu({
   			sections: [{
   				title: twoDays,
   				items: itemsTwo
   			}, {
   				title: 'Yesterday',
   				items: itemsYes
   			}, {
   				title: 'Today',
               items: itemsTod
   			}]
   		});
   
   		dailyProjects.show();
   }
}