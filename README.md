# Wula UI

>web ui for admin dashboard

## 目录结构

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

## 安装

```shell
git clone https://github.com/hezhiying/wui
cd wui
git clone https://github.com/hezhiying/iview
npm install
npm run dev
npm run hot
##open http://localhost:8080/examples
```
>前端脚手架基于laravel-mix
https://github.com/JeffreyWay/laravel-mix

> 相关资源 
https://www.iviewui.com/docs/guide/install
http://cn.vuejs.org/v2/api/

## Ajax 数据交互
json 协议格式

### message
> code值：200|success 300|info 400|warning 500|error
> style值：message|default notice confirm|确认框
```$javascript
{
  "code": 200, 
  "message": "登入数据提交成功！",
  "style":"message"
}
```
### redirect
```
{
  code:200,
  action:'redirect',
  target:'http://...'
}
```
### validate
```
{
  code:500,
  action:'validate',
  args:{
    errors:{
        username:'用户名不存在',
        password:['密码长度不足','密码强度不足']
    }
  }
}
```
### dialog
> 如果args.ajax存在，dialog会动态ajax加载url为这个窗口内容，否则会获取content内容

```
{
  "code": 200,
  "message": "这是一则消息提示信息！",
  "action": "dialog",
  "style":"message",
  "args": {
    "ajax": "/examples/components/dialog.html",
    "title": "title",
    "content": "9999",
    "width": "800",
    "height": "300",
    "showOk": false
  }
}

```

### 使用方法

```$javascript

new Vue({
        el:'#app',
        methods:{
            handle(){
                this.$Ajax.get(url).json(json=>{
                    //成功后自定义逻辑
                }).done().fail()
            }
        }
    })
    
```

## 组件列表

- [ajax-button](docs/ajax-button.md)
