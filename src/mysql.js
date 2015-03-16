var mysql = require('mysql'),
	connection;

function connect() {
	var options = {
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME
	};
	console.log(options);
	connection = mysql.createConnection(options);
	connection.connect();
}

function query(queryText, callback, params) {
	console.log("Running mysql query: " + queryText);
	console.log("query params: " + params);
	callback = callback;
	connect();
	if (params === null) {
		params = [];
	}
	results = connection.query(queryText, params, function(err, queryResponse, queryFields) {
		console.log("query complete. running callback");
		if (err) throw err;

		var i,
			rows;
		var string = "";
		var results = {};
		//results.fields = [];
		//if it is a stored procedure, the query results are in the first element of the array, and the mysql metadata is in the second element (e.g. affectedRows, insertId, etc)
		if (queryResponse.hasOwnProperty('affectedRows')) {
			console.log("execution complete. affected rows:", queryResponse.affectedRows);
			callback({affectedRows: queryResponse.affectedRows});
		} else {
			if (queryResponse[0].hasOwnProperty('0')) {
				rows = queryResponse[0];
				console.log("mysql metadata:", queryResponse[1]);
			} else {
				rows = queryResponse;
			}
			if (queryFields[0].hasOwnProperty('0')) {
				fields = queryFields[0];
			} else {
				fields = queryFields;
			}
			results.rows = [];
			//console.log("fields", fields);
			for (i in fields) {
				if (typeof fields[i] === "undefined") {
					continue;
				}
				string += fields[i].name + "\t";
			}
			//console.log("rows", rows);
			//console.log("fields", fields);
			//console.log("string", string);
			//console.log("iterating over " + rows.length + " rows");
			for (j in rows) {
				string = "";
				results.rows[j] = {};
				for (i in fields) {
					if (typeof fields[i] === "undefined") {
						continue;
					}
					//console.log("field:" + fields[i].name);
					//results.fields[i] = fields[i].name;
					results.rows[j][fields[i].name] = rows[j][fields[i].name];
					string += rows[j][fields[i].name] + "\t";
				}
			//console.log(string);
			}
			console.log("query results:" + results.rows.length);
			callback(results);
		}
	});
	connection.end();
}

function onQuery(err, rows, fields) {
	if (err) throw err;
	var i;
	var string = "";
	for (i in fields) {
		string += fields[i].name + "\t";
	}
	console.log(string);
	for (j in rows) {
		string = "";
		for (i in fields) {
			//console.log("field:" + fields[i].name);
			string += rows[j][fields[i].name] + "\t";
		}
		//console.log(string);
	}
}

exports.query = query;
