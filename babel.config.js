module.exports = {
    sourceType: 'module',
    presets: [
        '@babel/preset-react',
        ['@babel/preset-env', {
            targets: {
                browsers: ['last 2 versions'],
                // esmodules: true
            }
        }]
    ]
}
