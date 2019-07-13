import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import storageUtils from "./utils/storageUtils"
import memoryUtils from './utils/memoryUtils'
import * as serviceWorker from './serviceWorker';

const user = storageUtils.getUser()
memoryUtils.user = user

// 读取loacl中保存user,保存到内存中


// 入口文件
ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
