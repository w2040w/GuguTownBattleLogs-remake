let replace = require('@rollup/plugin-replace');

module.exports = {
    input: 'src/index.js',
    output: {
        file: 'dist/bundle.js',
        format: 'es',
    },
    plugins: [
        replace({
            'process.env.NODE_ENV': 'undefined',
        })
    ]
};
