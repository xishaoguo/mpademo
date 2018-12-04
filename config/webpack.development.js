const CopyWebpackPlugin = require('copy-webpack-plugin');
const {
    join
} = require("path");
module.exports = {
    output: {
        filename: "scripts/[name].bundles.js"
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: join(__dirname, "../" + "/src/webapp/views/common/layout.html"),
            to: '../views/common/layout.html'
        }]),
        new CopyWebpackPlugin([{
            from: join(__dirname, "../" + "/src/webapp/components"),
            to: '../components'
        }],{
            copyUnmodified:true, //只打包copy内容
            ignore:["*.js","*.css",".DS_Store"]
        })
    ]
};