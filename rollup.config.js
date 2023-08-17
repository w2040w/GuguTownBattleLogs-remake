let replace = require('@rollup/plugin-replace');
let css = require('rollup-plugin-import-css');

module.exports = {
    input: 'src/index.js',
    output: {
        file: 'dist/bundle.js',
        format: 'es',
    },
    plugins: [
        css(),
        replace({
            values: {
                'process.env.NODE_ENV': 'undefined',
            },
            preventAssignment: true
        })
    ]
};
