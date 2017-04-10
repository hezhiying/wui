let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for your application, as well as bundling up your JS files.
 |
 */

/**
 * mix options
 * extractVueStyles: './vue.css', 提取vue中的css文件
 */
mix.webpackConfig({
    externals: {
        "jquery": "jQuery",
        "vue": "Vue"
    }
})

/**
 * 不处理css中的URL
 */
mix.options({
    processCssUrls: false
});

/**
 * 输出文件
 * @type {string}
 */
let outScriptFilename = "ui.js";
let outStyleFilename = "ui.css";

/**
 * build style
 */
mix.less('./src/styles/my-iview.less', './test/', {
    relativeUrls: false
})
    .sass('./src/styles/index.scss', './test/')
    .styles(['test/my-iview.css', 'test/index.css'], `dist/styles/${outStyleFilename}`);


mix.js('./src/main.js', `test/main.js`);
if (mix.config.inProduction) {
    mix.scripts(['./node_modules/vue/dist/vue.min.js', './node_modules/jquery/dist/jquery.min.js', `test/main.js`], `dist/${outScriptFilename}`);
} else {
    mix.scripts(['./node_modules/vue/dist/vue.js', './node_modules/jquery/dist/jquery.js', `test/main.js`], `dist/${outScriptFilename}`);
}
if (mix.config.inProduction) {
    mix.copyDirectory('node_modules/font-awesome/fonts', './dist/styles/fonts/font-awesome');
    mix.copyDirectory('node_modules/iview/dist/styles/fonts', './dist/styles/fonts/iview');
    mix.copyDirectory('src/styles/assets', './dist/styles/assets');
    mix.minify(`./dist/styles/${outStyleFilename}`);
    mix.minify(`./dist/${outScriptFilename}`);
}


// Full API
// mix.js(src, output);
// mix.react(src, output); <-- Identical to mix.js(), but registers React Babel compilation.
// mix.extract(vendorLibs);
// mix.sass(src, output);
// mix.less(src, output);
// mix.stylus(src, output);
// mix.browserSync('my-site.dev');
// mix.combine(files, destination);
// mix.babel(files, destination); <-- Identical to mix.combine(), but also includes Babel compilation.
// mix.copy(from, to);
// mix.copyDirectory(fromDir, toDir);
// mix.minify(file);
// mix.sourceMaps(); // Enable sourcemaps
// mix.version(); // Enable versioning.
// mix.disableNotifications();
// mix.setPublicPath('path/to/public');
// mix.setResourceRoot('prefix/for/resource/locators');
// mix.autoload({}); <-- Will be passed to Webpack's ProvidePlugin.
// mix.webpackConfig({}); <-- Override webpack.config.js, without editing the file directly.
// mix.then(function () {}) <-- Will be triggered each time Webpack finishes building.
// mix.options({
//   extractVueStyles: false, // Extract .vue component styling to file, rather than inline.
//   processCssUrls: true, // Process/optimize relative stylesheet url()'s. Set to false, if you don't want them touched.
//   purifyCss: false, // Remove unused CSS selectors.
//   uglify: {}, // Uglify-specific options. https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
//   postCss: [] // Post-CSS options: https://github.com/postcss/postcss/blob/master/docs/plugins.md
// });
