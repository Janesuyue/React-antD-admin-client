
// 加载了全部的 antd 组件的样式会造成对前端性能的忧患
const { override, fixBabelImports, addLessLoader } = require('customize-cra')

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),

    addLessLoader({
        javascriptEnabled: true,
         modifyVars: { '@primary-color': '#1DA57A' },
       }),
);
