const http = require('http');
const path = require('path');
const fs = require('fs');
const ws = require('ws');
const config = require('../config');
const Storage = require('./Storage');
const Printer = require('./Printer');
const template = require(config.template);

const storage = new Storage('records');

const httpServer = http.createServer(function(req, res) {
	if (req.url === '/') {
		handleReceive(req, res);

	} else if (req.url === '/logs') {
		handleOutput(req, res);

	} else if (req.url.indexOf('/static') > -1) {
		servingStatic(req, res);

	} else {
		handle404(req, res);
	}
});

httpServer.listen(config.http.port, config.http.host, function() {
	const { address, port } = httpServer.address();
	console.log(`HTTP server is running at http://${address}:${port}/`);
});


const socketServer = new ws.Server({
	port: config.socket.port,
});

socketServer.on('connection', function(socket) {
	const sender = function(record) {
		socket.send(JSON.stringify(record));
	};

	storage.addListener('added', sender);

	socket.on('close', function() {
		storage.removeListener('added', sender);
	});
});


function handleReceive(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

	if (req.method !== 'POST') {
		res.writeHead(200);
		res.end();
		return;
	}

	let data = '';
	let record = null;

	req.setEncoding(config.http.encoding);
	req.on('data', (chunk) => {
		data += chunk;
	});
	req.on('end', () => {
		try {
			record = JSON.parse(data);
		}
		catch (error) {
			end(400, 'Invalid record');
			return;
		}

		if (!record.name
				|| !record.levelname
				|| !record.created
				|| !record.message) {
			end(400, 'Invalid record');
			return;
		}

		storage.add(record);
		Printer.fixedPrint(storage.getLength());
		end();
	});

	function end(status = 200, data = 'OK') {
		res.writeHead(status);
		res.end(data);
	}
}

function handleOutput(req, res) {
	const records = storage.getAll();
	const output = template.replace('%(records)', JSON.stringify(records));

	res.writeHead(200);
	res.end(output);
}

function handle404(req, res) {
	res.writeHead(404);
	res.end();
}

function servingStatic(req, res) {
	const filePath = path.resolve(path.dirname(__filename), '../');
	const fileName = req.url.replace('/static/', `${filePath}/`);
	const extname = path.extname(fileName);
	let contentType = 'text/html';

	switch (extname) {
		case '.js':
			contentType = 'text/javascript';
			break;
		case '.css':
			contentType = 'text/css';
			break;
		case '.json':
			contentType = 'application/json';
			break;
		case '.png':
			contentType = 'image/png';
			break;      
		case '.jpg':
			contentType = 'image/jpg';
			break;
		case '.wav':
			contentType = 'audio/wav';
			break;
	}

	fs.readFile(fileName, function(error, content) {
		if (error) {
			if (error.code == 'ENOENT') {
				// TODO
				res.writeHead(500);
				res.end(); 

			} else {
				res.writeHead(500);
				res.end(); 
			}
		}
		else {
			res.writeHead(200, { 'Content-Type': contentType });
			res.end(content, 'utf-8');
		}
	});
}
