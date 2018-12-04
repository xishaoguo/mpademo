const pluginName = 'htmlAfterWebpackPlugin';
const assetsHelp = (data) => {
    let css = [],
        js = [];
    const dir = {
        js: item => `<script src="${item}"></script>`,
        css: item => `<link rel="stylesheet" href=${item}>`
    }
    for (let jsitem of data.js) {
        js.push(dir.js(jsitem));
    }
    for (let cssitem of data.css) {
        css.push(dir.css(cssitem));
    }
    return {
        css,
        js
    }
}
class htmlAfterWebpackPlugin {
    apply(compiler) {
        compiler.hooks.compilation.tap(pluginName, compilation => {
            compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tap(pluginName, htmlPluginData => {
                let _html = htmlPluginData.html;
                _html = _html.replace(/widgets:/g, "../../../");
                
                _html = _html.replace(/common:/g, "../../common/");
                const result = assetsHelp(htmlPluginData.assets);
                _html = _html.replace("<!--injectcss-->", result.css.join(""));
                _html = _html.replace("<!--injectjs-->", result.js.join(""));
                htmlPluginData.html = _html;
            });
        });
    }
}
module.exports = htmlAfterWebpackPlugin;