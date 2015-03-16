var mysqlLib = require('mysql');
var mysql = require('./mysql');

function Device(serial) {
	this.serial = serial;
}

function findAll(callback) {
	var params = [],
		queryText = "call find_settings();",
		sql;
	sql = mysqlLib.format(queryText, params);
	mysql.query(
		sql,
		function(results) {
			var i,
				settings = [],
				l;
			for (var i = 0, l = results.length; i < l; i ++) {
				var row = results[i];
			}
			return callback(settings);
		},
		params
	);
}

function find(gtin, callback) {
	var params = [gtin],
		queryText = "call get_settings(?);",
		sql;
	sql = mysqlLib.format(queryText, params);
	mysql.query(
		sql,
		function(results) {
			var content = results.rows[0].content;
			return callback(content);
		},
		params
	);
}

function set(gtin, content, username, callback) {
	var params = [gtin, content, username],
		queryText = "call set_settings(?,?,?);",
		sql;
	console.log("content:", content);
	sql = mysqlLib.format(queryText, params);
	mysql.query(
		queryText,
		function(results) {
			return callback(results);
			return callback({success: true});
		},
		params
	);
}

function query(queryText, callback, params) {
}

exports.find = find;
exports.findAll = findAll;
exports.set = set;

function rowsToObjects(results) {
	var objects = [],
		object,
		row,
		i;
	for (i = 0; i < results.rows.length; i++) {
		row = results.rows[i];
		object = new Device(row.serial);
		objects.push(object);
	}
	return objects;
}

