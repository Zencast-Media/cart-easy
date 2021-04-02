const fs = require('fs');

module.exports = {
	entry: './index.js',
	target: 'node',
	externals: fs.readdirSync('node_modules').filter(x => x !== '.bin'),
};
