(function(GLOBAL) {
	var config = GLOBAL.config;
	var WebSocket = GLOBAL.WebSocket;

	function getConsoleMethod(levelname) {
		var map = {
			DEBUG: 'debug',
			INFO: 'info',
			WARNING: 'warn',
			ERROR: 'error',
			CRITICAL: 'error',
		};

		return map[levelname];
	}

	function log(record) {
		var method = getConsoleMethod(record.levelname);

		console[method].apply(console, [record]);
	}

	App = {};

	App.process = function (records) {
		for (var i = 0, len = records.length; i < len; i++) {
			log(records[i]);
		}

		if (typeof WebSocket === 'function') {
			var socket = new WebSocket(
				'ws://' + config.http.host + ':' + config.socket.port + '/'
			);

			socket.onclose = function () {
				console.warn('APP: Socket server closed.');
			};
			socket.onmessage = function (message) {
				var record = JSON.parse(message.data);

				log(record);
			};
		}
	};

	GLOBAL.App = App;
}(window));
