var path = require('path')

module.exports = {
    entry: './src/app/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build')
    }
};