#Wula UI

>web ui for admin dashboard
##目录结构
```
wui/
├── dist/
│   ├── styles/
│   │   ├── ui.min.css
│   │   └── ui.css
│   ├── ui.min.js
│   └── ui.js
├── test/
│ 
├── src/
│   ├── components/
│   │   ├── .../
│   │   │
│   │   └── index.js
│   │
│   ├── mixins/
│   ├── pages/
│   ├── utils/
│   ├── styles/
│   │
│   ├── main.js
│   └── iview.js
│
├── examples/
│   ├── components/
│   ├── json/
│   ├── index.html
│   └── login.html
│
├── iview/
├── node_modules/
│
├── .babelrc
├── .gitignore
├── .package.json
└── .webpack.mix.js
```

##安装
```shell
git clone https://github.com/hezhiying/wui
cd wui
git clone https://github.com/hezhiying/iview
npm install
npm run dev
npm run hot
##open http://localhost:8081/examples
```

> 相关资源 
https://www.iviewui.com/docs/guide/install
http://cn.vuejs.org/v2/api/