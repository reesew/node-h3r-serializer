var express = require("express");
var devices = require("./devices");
var bodyParser = require("body-parser");
var settings = require("./settings");
var validation = require("./validation");
var app = express();
var getRawBody = require('raw-body');

console.log("setting cors route");
app.use(function(request, response, next) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

var jsonParser = bodyParser.json();
var rawParser = bodyParser.raw();

var rawBodyParser = function (req, res, next) {
	getRawBody(req, {
		length: req.headers['content-length'],
		//encoding: typer.parse(req.headers['content-type']).parameters.charset,
		limit: '1mb'
	}, function (err, string) {
		if (err) {
			return next(err);
		}
		req.rawBody = string;
		next();
	})
};

//app.use(function (req, res, next) {
//	getRawBody(req, {
//		length: req.headers['content-length'],
//		//encoding: typer.parse(req.headers['content-type']).parameters.charset,
//		limit: '1mb'
//	}, function (err, string) {
//		if (err) {
//			return next(err);
//		}
//		req.rawBody = string;
//		next();
//	})
//})

//get request headers to set username
app.use(function(request, response, next) {
	request.user = false;
	if (request.headers.hasOwnProperty('username')) {
		request.user = request.headers.username;
	}
	console.log("method: ", request.method);
	console.log("user: ", request.user);
	if (request.method !== "GET" && request.user === false) {
		response.status(403);
		response.json({
			error: "No 'Username' header found",
			headers: request.headers
		});
	} else {
		next();
	}
});

app.get('/devices', function(request, response) {
	console.log('got GET request to /devices');
	devices.findAll(function(results) {
		response.json(results);
	});
});


app.put('/devices/:manufacturingSerial', jsonParser, function(request, response) {
	console.log('got PUT request to /devices/' + request.params.manufacturingSerial);
	var data = request.body;
	console.log(data);

	devices.set(request.params.manufacturingSerial, data, request.user, function(results) {
		response.json(results);
	});
});

app.get('/kill', function(request, response) {
	console.log('got GET request to /kill');
	device[0];
});

app.get('/settings', function(request, response) {
	console.log('got GET request to /settings');
	settings.findAll(function(results) {
		response.json(results);
	});
});

app.get('/settings/:gtin(\\d{14})', function(request, response) {
	console.log('got GET request to /settings/' + request.params.gtin);
	settings.find(request.params.gtin, function(results) {
		if (typeof results === "undefined") {
			response.status(404);
			response.json({error: "Settings for '" + request.params.gtin + "' not found"});
		} else {
			response.header("Content-Type", "application/binary");
			response.send(results);
		}
	});
});

app.put('/settings/:gtin(\\d{14})', rawBodyParser, function(request, response) {
	console.log('got PUT request to /settings/' + request.params.gtin);
	console.log('raw body:',  request.rawBody);
	settings.set(request.params.gtin, request.rawBody, request.user, function(results) {
		response.json(results);
	});
});

app.get('/validation/:gtin(\\d{14})', function(request, response) {
	console.log('got GET request to /validation/' + request.params.gtin);
	validation.find(request.params.gtin, function(results) {
		if (typeof results === "undefined") {
			response.status(404);
			response.json({error: "Validation parameters for '" + request.params.gtin + "' not found"});
		} else {
			response.header("Content-Type", "application/json");
			response.send(results);
		}
	});
});

app.put('/validation/:gtin(\\d{14})', jsonParser, function(request, response) {
	console.log('got PUT request to /validation/' + request.params.gtin);
	var data = request.body;
	console.log(data);

	validation.set(request.params.gtin, data, request.user, function(results) {
		response.json(results);
	});
});

//last middleware, if no route found, 404
app.use(function(request, response, next) {
	response.status(404);
	response.json({error: "Unable to route request"});
	next();
});

var server = app.listen(80, function() {
});
