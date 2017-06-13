## 运行
- npm install 或者 yarn install 
- npm run dev 或者 yarn dev 执行开发模式
- npm run build 或者 yarn build 打包工程
- npm run prod 或者 yarn prod 打包线上工程

## react工程
react工程依赖
https://github.com/lihaichen/webpack2Demo
## 主要修改记录
- webpack配置文件加入  target: 'electron-renderer' ，指示打包的程序是electron渲染线程，不是web程序，编译的程序只能在electron打开。
- plugins中加入 new webpack.DefinePlugin({ "global.GENTLY": false })，不然会出现require函数没有找到，原理不是很懂。
- 添加node目录，node目录是操作底层的接口，比较文件的操作，数据库等。
- 将webpack的配置文件output->publicPath 置空
- 图片放到static/images 引用时不能加 '/'。
- 