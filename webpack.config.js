var path = require('path');
var Uglify = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: './assets/scripts/app.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, './js'),
    },
    plugins: [
        new Uglify({
            uglifyOptions: {
                output: {
                    comments: false
                }
            }
        })
    ]
};