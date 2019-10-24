module.exports = {
    sourceType: 'module',
    presets: [
        ['@babel/preset-env', {
            targets: {
                esmodules: true
            }
        }],
        '@babel/preset-react'
    ]
}
