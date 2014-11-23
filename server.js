var http = require('http');
var SonosDiscovery = require('sonos-discovery');
var SonosHttpAPI = require('./lib/sonos-http-api.js');
var fs = require('fs');
var path = require('path');
var requireFu = require('require-fu');

var settings = {
  port: 5005,
  cacheDir: './cache'
}

var presets = {};
var discovery = new SonosDiscovery(settings);
var api;

try {
  var userSettings = require(path.resolve(__dirname, 'settings.json'));
} catch (e) {
  console.log('no settings file found, will only use default settings');
}

if (userSettings) {
  for (var i in userSettings) {
    settings[i] = userSettings[i];
  }
}

fs.exists('./presets.json', function (exists) {
	if (exists) {
		presets = require('./presets.json');
		console.log('loaded presets', presets);
	} else {
		console.log('no preset file, ignoring...');
	}
	api = new SonosHttpAPI(discovery, settings, presets);
	requireFu(__dirname + '/lib/actions')(api);
});

