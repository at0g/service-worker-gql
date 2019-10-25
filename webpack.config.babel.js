import path from 'path'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import { InjectManifest } from 'workbox-webpack-plugin'

export default {
    devtool: 'cheap-module-eval-source-map',
    target: 'web',
    entry: path.resolve('./src/entry-web.js'),
    output: {
        path: path.resolve('./dist/web'),
        publicPath: '/',
        filename: '[name]-[contenthash].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve('./src'),
                use: 'babel-loader'
            }
        ]
    },
    externals: {
        // react: 'React',
        // 'react-dom': 'ReactDOM'
    },
    optimization: {
        moduleIds: 'hashed',
        runtimeChunk: {
            name: 'webpackRuntime',
        },
    },
    plugins: [
        new CleanWebpackPlugin(),
        new InjectManifest({
            swDest: 'sw.js',
            swSrc: path.resolve('./src/sw-template.js'),
            include: [/\.js$/, /\.css$/],
        }),
    ],
    devServer: {
        contentBase: false,
        // set to false or req.url will be "/" in devServer.after callback
        historyApiFallback: false,
        // https: false,
        stats: 'minimal',
        overlay: {
            warnings: true,
            errors: true,
        },
        after: (app, server) => {
            app
                .use((req, res, next) => {
                    req.url = req.url
                        .replace(/\/index\.html/, '/')
                    next()
                })
                .use((req, res, next) => {
                    if (path.extname(req.url) !== '') {
                        console.log('skipping: ', req.url)
                        return next()
                    }
                    console.log('processing ', req.url)

                    server.middleware.waitUntilValid((stats) => {
                        const externals = [
                            // 'https://unpkg.com/react@16.10.2/umd/react.development.js',
                            // 'https://unpkg.com/react-dom@16.10.2/umd/react-dom.development.js',
                        ]
                        const assets = stats.compilation.entrypoints.get("main").chunks
                            .reduce((memo, chunk) => [...memo, ...chunk.files], [])
                            .map(src => stats.compilation.compiler.options.output.publicPath + src)

                        const scripts = [
                            ...externals,
                            ...assets.filter(url => /\.js$/.test(url))
                        ]

                        res
                            .send(`
<!doctype html>
<html>
<head>
<title>PWA from WDS</title>
</head>
<body>
<div>${req.url}</div>
<div id="appContainer"></div>
${scripts.map(src => `<script src="${src}"></script>`).join('\n')}
</body>
</html>                    
`
                            )
                            .end()
                        return next()
                    })
                })
        }
    },
}
