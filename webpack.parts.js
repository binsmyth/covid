const MiniCssExtractPlugin = require('mini-css-extract-plugin');

exports.devServer = ({ host, port } = {}) => ({
    devServer:{
        stats: "errors-only",
        host,
        port: 8082,
        open: 'chrome',
        overlay: true,
    }
});

exports.loadCSS = ({ include, exclude } = {}) =>({
    module: {
        rules:[
            {
                test:/\.css$/,
                include,
                exclude,
                use:["style-loader","css-loader"],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                loader: 'file-loader',
                options:{
                    name: '[path][name].[ext]',
            },
            }
        ],
    },
});

exports.extractCSS = ({include, exclude, use= [] }) =>{
    const plugin = new MiniCssExtractPlugin({
        filename: "[name].css",
    });

    return {
        module:{
            rules:[
                {
                    test: /\.css$/,
                    include,
                    exclude,
                    use:[
                        MiniCssExtractPlugin.loader,
                    ].concat(use),
                },
            ],
        },
        plugins:[plugin],
    };
};