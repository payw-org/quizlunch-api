var path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
    target: "node",
    entry: {
        app:['./src/app/main.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                options: {
                  presets: ["@babel/preset-env"]
                }
            }
        ]
    },
    plugins: [],
    externals: [nodeExternals()]
};