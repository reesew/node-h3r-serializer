var mysqlLib = require('mysql');
var mysql = require('./mysql');

function Device(tz_serial, manufacturing_serial, gtin, sim_number, imei, pcb_part_number, firmware_version) {
	this.tzSerial = tz_serial;
	this.manufacturingSerial = manufacturing_serial;
	this.gtin = gtin;
	this.iccid = sim_number;
	this.imei = imei;
	this.pcbPartNumber = pcb_part_number;
	this.firmwareVersion = firmware_version;
}

function findAll(callback) {
	query("call get_devices()", callback);
}

function set(manufacturingSerial, device, username, callback) {
	var params = [
		device.gtin,
		manufacturingSerial,
		device.tzSerial,
		device.firmwareVersion,
		device.pcbPartNumber,
		device.imei,
		device.iccid,
		username
	]
	var queryText = "call set_device(?,?,?,?,?,?,?,?)",
		sql;
	sql = mysqlLib.format(queryText, params);
	console.log("sql:", sql);
	mysql.query(
		sql,
		function(results) {
			callback({success: true});
		},
		params
	);
	//query(queryText, callback, params);
}

function query(queryText, callback) {
	mysql.query(queryText, function(results) {
		var objects = rowsToObjects(results);
		return callback(objects);
	});
}

function rowsToObjects(results) {
	var objects = [],
		object,
		row,
		i;
	for (i = 0; i < results.rows.length; i++) {
		row = results.rows[i];
		object = new Device(row.tz_serial, row.manufacturing_serial, row.gtin, row.sim_number, row.imei, row.pcb_part_number, row.firmware_version);
		objects.push(object);
	}
	return objects;
}

exports.findAll = findAll;
exports.set = set;
