# AjaxButon 按钮

按钮用于开始一个远程访问即时操作

## 何时使用

标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。

## 代码演示

::: demo
<summary>

  #### dialog按钮
  
  dialog按钮有两种方式：通过加载json数据打开、通过加载html直接打开。
  
  注意：通过html打开时，支持html内容中含有`<div id='dialog-title'>窗口标题</div>`,给当前窗口标题赋值。
</summary>

```html
<ajax-button type="primary" url="/examples/components/dialog/html.json">Dialog</ajax-button>
<ajax-button type="dashed" url="/examples/components/dialog/html.html" dialog>html-dialog</ajax-button>
<ajax-button type="dashed" url="/examples/components/dialog/html.html" :dialog="{title:'窗口标题', width:600}">html-dialog 自定义窗口属性</ajax-button>
```
:::

## API

### AjaxButton Props
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |-------------------------------- |--------- |
| url | 请求地址 | string | 必须输入 | - |
| method | 请求方法 | string | get post put delete | get |
| params | 请求参数 | Object or String | | - |
| confirm | popTip 确认提示 | String | 确认提示内容 | - |
| placement | popTip 显示位置 | String | 'top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end' | top |
| showLoading | 加载时是否显示动画 | Boolean | true false | true |
| dialog | modal显示 | Object or Boolean | `{title:'',width:520,...}` | - |

### Dialog Props
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |-------------------------------- |-------- |
| title | 标题 | String | | - |
| width | 宽度 | Int | | 520 |
| okText | 确认按钮文字 | String | | 确定 |
| cancelText | 取消按钮文字 | String | | 取消 |
| showOk | 显示确认按钮 | Boolean | true false | true
| showCancel | 显示取消按钮 | Boolean | true false | false
| content | modal 内容 | String | Html内容<会自动加载vue元素> | - |
| url | 动态加载modal 内容 | String | `url`优先级高于`content`| - |
>modal内容支持 `<div id="dialog-title">窗口标题内容</div>`,将会自动把内容替换为窗口标题


### Button Props
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |-------------------------------- |-------- |
| type | 按钮类型 | String | 可选值为primary、ghost、dashed、text、info、success、warning、error或者不设置 | - | 
| size | 按钮大小 | String | 可选值为large和small或者不设置 | - |
| shape | 按钮形状 | String | 可选值为circle或者不设置 | - |
| long | 开启后，按钮的长度为 100% | Boolean | true false | false |
| html-type |	 设置button原生的type | String | button、submit、reset | button|
| disabled | 设置按钮为禁用状态 | Boolean | true false | false |
| icon | 设置按钮的图标类型 | String | iview图标库 | - |

> 更详细请参阅[Button](https://www.iviewui.com/components/button)组件介绍
