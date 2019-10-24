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
        react: 'React',
        'react-dom': 'ReactDOM'
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
            include: ['/app-shell', /\.js$/, /\.css$/],
            templatedURLs: {
                '/app-shell': new Date().toString(),
            },
        }),
    ],
    devServer: {
        contentBase: false,
        // historyApiFallback: true,
        // https: false,
        stats: 'minimal',
        overlay: {
            warnings: true,
            errors: true,
        },
        after: (app, server) => {
            app.use((req, res, next) => {
                if (path.extname(req.url) !== '') {
                    return next()
                    // console.log('readFile', compiler.outputFileSystem.readFileSync('main.js'))
                }

                server.middleware.waitUntilValid((stats) => {
                    const externals = [
                        'https://unpkg.com/react@16.10.2/umd/react.development.js',
                        'https://unpkg.com/react-dom@16.10.2/umd/react-dom.development.js',
                    ]
                    const assets = stats.compilation.entrypoints.get("main").chunks
                        .reduce((memo, chunk) => [...memo, ...chunk.files], [])
                        .map(src => stats.compilation.compiler.options.output.publicPath + src)

                    const scripts = [
                        ...externals,
                        ...assets.filter(url => /\.js$/.test(url))
                    ]

                    res.send(`
<!doctype html>
<html>
<head>
<title>PWA from WDS</title>
</head>
<body>
<div id="appContainer">${req.url}</div>
${scripts.map(src => `<script src="${src}"></script>`).join('\n')}
</body>
</html>                    
`).end()

                    return next()
                })
            })
        }
    },
}
