var path = require('path')

module.exports = {
    target: "node",
    entry: {
        app:['./src/app/main.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build')
    },
    externals: [nodeExternals()]
};