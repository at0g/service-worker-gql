module.exports = {
    presets: [
        ['@babel/preset-env', {
            modules: false,
            targets: {
                esmodules: true
            }
        }],
        '@babel/preset-react',
    ],
    plugins: [
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-class-properties',
    ],
    env: {
        webpack: {
            plugins: ['react-hot-loader/babel'],
        },
        node: {
            plugins: [
                'babel-plugin-graphql-tag',
                '@babel/plugin-transform-modules-commonjs',
                'babel-plugin-dynamic-import-node',
            ],
        },
    }
}
