import path from 'path'
import webpack from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import { InjectManifest } from 'workbox-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import template from 'html-webpack-template'
import fetch from 'node-fetch'
import bodyParser from 'body-parser'

const externals = [
    'https://unpkg.com/react@16.10.2/umd/react.development.js',
    // 'https://unpkg.com/react-dom@16.10.2/umd/react-dom.development.js',
]

export default {
    devtool: 'cheap-module-eval-source-map',
    target: 'web',
    entry: {
        main: ['react-hot-loader/patch', path.resolve('./src/main.js')],
    },
    output: {
        path: path.resolve('./dist/web'),
        publicPath: '/',
        filename: '[name]-[hash].js',
        chunkFilename: '[name]-[chunkhash].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        envName: 'webpack',
                    },
                },
            },
            {
                test: /\.graphql$/,
                exclude: /node_modules/,
                loader: 'graphql-tag/loader',
            },
        ],
    },
    externals: {
        react: 'React',
        // 'react-dom': 'ReactDOM'
    },
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom',
        },
    },
    optimization: {
        moduleIds: 'hashed',
        runtimeChunk: {
            name: 'webpackRuntime',
        },
        splitChunks: {
            name: true,
            cacheGroups: {
                vendors: {
                    test: /\/node_modules\//,
                    chunks: 'all',
                    enforce: true,
                    priority: -10,
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
        new InjectManifest({
            swDest: 'sw.js',
            swSrc: path.resolve('./src/sw-template.js'),
            include: [/\.js$/, /\.css$/],
        }),
        new HtmlWebpackPlugin({
            inject: false,
            template,
            appMountId: 'appContainer',
            scripts: externals,
        }),
    ],
    devServer: {
        contentBase: false,
        // set to false or req.url will be "/" in devServer.after callback
        historyApiFallback: false,
        https: false,
        hot: true,
        stats: 'minimal',
        overlay: {
            warnings: true,
            errors: true,
        },
        after: (app, server) => {
            app.post(
                '/graphql',
                bodyParser.raw({ type: '*/*' }),
                (req, res, next) => {
                    return fetch('http://localhost:5000', {
                        method: 'post',
                        body: req.body.toString(),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                        .then(result => {
                            if (!result.ok) {
                                return result.text().then(message => {
                                    throw new Error(message)
                                })
                            }
                            return result.json().then(data => res.json(data))
                        })
                        .catch(next)
                }
            )

            app.use((req, res, next) => {
                req.url = req.url.replace(/\/index\.html/, '/')
                next()
            })
            app.use((req, res, next) => {
                if (path.extname(req.url) !== '') {
                    console.log('skipping: ', req.url)
                    return next()
                }
                console.log('processing ', req.url)

                server.middleware.waitUntilValid(stats => {
                    const assets = stats.compilation.entrypoints
                        .get('main')
                        .chunks.reduce(
                            (memo, chunk) => [...memo, ...chunk.files],
                            []
                        )
                        .map(
                            src =>
                                stats.compilation.compiler.options.output
                                    .publicPath + src
                        )

                    const scripts = [
                        ...externals,
                        ...assets.filter(url => /\.js$/.test(url)),
                    ]

                    res.send(
                        `
<!doctype html>
<html>
<head>
<title>PWA from WDS</title>
</head>
<body>

<header>
    <pre>Document URL: ${req.url}</pre>
</header>

<div id="appContainer"></div>

${scripts.map(src => `<script src="${src}"></script>`).join('\n')}

</body>
</html>                    
`
                    ).end()
                    return next()
                })
            })
        },
    },
}
