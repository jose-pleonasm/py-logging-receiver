const EventEmitter = require('events').EventEmitter;
const util = require('util');

function Storage(name) {
	name = name || 'main';

	EventEmitter.call(this);
	this._name = name;
	this._records = [];
}
util.inherits(Storage, EventEmitter);

Storage.prototype.add = function (record) {
	this._records.push(record);
	this.sort();
	this.emit('added', record);
};

Storage.prototype.getLength = function () {
	return this._records.length;
};

Storage.prototype.getAll = function () {
	return this._records;
};

Storage.prototype.sort = function () {
	this._records.sort(function (a, b) { return a.created - b.created; });
};

module.exports = Storage;
