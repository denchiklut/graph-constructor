const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'public'),
        libraryTarget: 'commonjs2'
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.js/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(css|sass|scss)$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|mtl|obj|pdf)$/,
                use: [
                    'url-loader',
                ]
            }
        ]
    }
};
