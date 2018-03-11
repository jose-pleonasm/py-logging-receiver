
const config = Object.freeze({
	http: {
		port: 8081,
		host: '127.0.0.1',
		encoding: 'utf8',
	},
	socket: {
		port: 8001,
	},
	template: './template.js',
});


if (typeof module === 'object' && module && module.exports) {
	module.exports = config;
}
if (typeof window === 'object' && window) {
	window.config = config;
}
