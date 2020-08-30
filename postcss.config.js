const cssnano = require('cssnano');
const postcssnested = require('postcss-nested');

module.exports = {
plugins: [
postcssnested,
cssnano({
    preset: 'default',
}),
]
} 