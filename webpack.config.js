const HtmlWebpackPlugin = require('html-webpack-plugin');
const htmlAfterWebpackPlugin = require("./config/htmlAfterWebpackPlugin.js");
const argv = require('yargs-parser')(process.argv.slice(2));
const merge = require("webpack-merge");
const _mode = argv.mode || "development";
const _prodMode = (_mode == "production" ? true : false);
const _config = require(`./config/webpack.${_mode}.js`);
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const setTitle = require('node-bash-title');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
const glob = require("glob");
setTitle('🍻  这是' + _mode + "窗口");
const {
    resolve,
    join
} = require("path");
const files = glob.sync("./src/webapp/views/**/*.entry.js");
//需要去处理的入口文件
let _entry = {};
let _plugins = [];
for (let item of files) {
    //index-test.entry.js
    if (/.+\/([a-zA-Z]+-[a-zA-Z]+)(\.entry\.js$)/g.test(item) == true) {
        const entryKey = RegExp.$1;
        _entry[entryKey] = item;
        const [dist, template] = entryKey.split("-");
        _plugins.push(new HtmlWebpackPlugin({
            filename: `../views/${dist}/pages/${template}.html`,
            template: `src/webapp/views/${dist}/pages/${template}.html`,
            chunks: ["runtime", "common", entryKey],
            minify: {
                removeComments: _prodMode,
                collapseWhitespace: _prodMode
            },
            inject: false
        }))
    }
}
let webpackConfig = {
    entry:_entry,
    module: {
        rules: [{
            test: /\.(gif|png|jpe?g|svg)$/i,
            use: [
                'file-loader',
                {
                    loader: 'image-webpack-loader',
                    options: {
                        pngquant: {
                            quality: '65-90',
                            speed: 4
                        }
                    }
                },
            ],
        }, {
            test: /\.(png|jpg|gif|ttf|otf|svg)$/i,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 10 * 1024
                }
            }]
        },{
            test: /\.css$/,
            use: [{
                loader: MiniCssExtractPlugin.loader
            }, {
                loader: 'css-loader',
                options: {
                    modules: true,
                    localIdentName: '[path][name]__[local]--[hash:base64:5]'
                }
            }]
        }]
    },
    output: {
        path: join(__dirname, "./dist/assets"),
        publicPath: "/",
        filename: "scripts/[name].bundle.js"
    },
    optimization: {
        noEmitOnErrors: false,
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: 'initial',
                    name: "common",
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0
                }
            }
        },
        runtimeChunk: {
            name: "runtime"
        }
    },
    plugins: [
        new WebpackBuildNotifierPlugin({
            title: "webpack执行结果",
            logo: resolve("/yuyu_xiao.png"),
            suppressSuccess: true
        }),
        new MiniCssExtractPlugin({
            filename: _prodMode ? "styles/[name].[contenthash:5].css" : "styles/[name].css",
            chunkFilename: _prodMode ? "styles/[id].[contenthash:5].css" : "styles/[id].css"
        }),
        new ProgressBarPlugin(),
        ..._plugins,
        new htmlAfterWebpackPlugin()//一定要写在后面，要不然会勾不到东西
    ]
}
module.exports = merge(_config, webpackConfig);