var mysqlLib = require('mysql');
var mysql = require('./mysql');

function find(gtin, callback) {
	var params = [gtin],
		queryText = "call get_validation(?);",
		sql;
	sql = mysqlLib.format(queryText, params);
	mysql.query(
		sql,
		function(results) {
			var validation;
			if (results.rows.length === 1) {
				validation = {
					gtin: results.rows[0].gtin,
					pcbPartNumber: results.rows[0].pcb_part_number,
					description: results.rows[0].description
				};
			}
			return callback(validation);
		},
		params
	);
}

function set(gtin, validation, username, callback) {
	var params = [
			gtin,
			validation.pcbPartNumber,
			validation.description,
			username
		],
		queryText = "call set_validation(?,?,?,?);",
		sql;
	sql = mysqlLib.format(queryText, params);
	mysql.query(
		queryText,
		function(results) {
			return callback(results);
		},
		params
	);
}

exports.find = find;
exports.set = set;
