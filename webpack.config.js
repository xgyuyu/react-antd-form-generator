const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { ESBuildMinifyPlugin } = require('esbuild-loader')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

const devMode = process.env.NODE_ENV !== 'production'

// 公用方法配置文件目录
function resolve(dir) {
    // join方法用于将多个字符串结合成一个路径字符串
    // __dirname：获取当前文件所在目录的完整绝对路径
    return path.join(__dirname, './', dir)
}

module.exports = {
    entry: {
        "main": "/src/index.jsx"
    },
    output: {
        // 指明编译好的文件所在目录
        path: path.resolve('./dist'),
        // 加上哈希值 就是[hash:8].
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use : [
                    { loader: 'style-loader' },
                    {
                        loader: "css-loader",
                        options: {
                            url: false,
                        },
                    }
                ]
            },
            {
                test: /\.less$/,
                use : [
                    { loader: 'style-loader' },
                    {
                        loader: "css-loader",
                        options: {
                            url: false,
                        },
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            modifyVars: {
                                'primary-color': '#F56C1D',
                                'info-color': '#F56C1D'
                            },
                            javascriptEnabled: true
                        }
                    }
                ]
            },
            {
                test: /\.(jsx|js)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "swc-loader",
                }
            },
            {
                test: /\.jsx$/,
                loader: 'esbuild-loader',
                options: {
                    loader: 'jsx',
                }
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'static/media/[name].[hash:8].[ext]'
                }
            },
            {
                loader: 'file-loader',
                exclude: [/\.(js|mjs|jsx|ts|tsx|css|less|png|jpg|gif|bmp|jpeg)$/, /\.html$/, /\.json$/],
                options: {
                    name: 'static/media/[name].[hash:8].[ext]',
                }
            }
        ]
    },
    // 文件解析
    resolve: {
        extensions: ['.js', ".jsx", '.json', '.less', '.css'], // 自动解析确定的拓展名,使导入模块时不带拓展名
        alias: { // 创建import或require的别名,让其自动解析确定的扩展,在引入模块时不带扩展名
            '@': resolve('src'),
        },
    },
    optimization: {
        minimizer: [
           new ESBuildMinifyPlugin({
               target: 'es2015'
            }),
        ]
    },
    // 插件配置
    plugins: [
        new NodePolyfillPlugin(),
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        }),
        // 打包html插件
        // 如果先清空build在进行打包
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './index.html', // 指定模板
        }),
    ],
    devtool: 'source-map',
    mode: 'development', // 更改生产模式
    devServer: {
        port: 3004,
        compress: true, // 服务器压缩
        open: false, // 自动打开浏览器
        hot: true, // 热更新
        // proxy:{} // url代理
    },
}
