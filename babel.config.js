module.exports = {
    sourceType: 'module',
    presets: [
        '@babel/preset-react',
        ['@babel/preset-env', {
            targets: {
                esmodules: true
            }
        }]
    ]
}
