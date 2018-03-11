const readline = require('readline');

let printed = false;

function fixedPrint(text) {
	if (printed) {
		readline.clearLine(process.stdout, 0);
		readline.cursorTo(process.stdout, 0, null);
	}
	process.stdout.write(String(text));
	printed = true;
}

module.exports = {
	fixedPrint,
};
