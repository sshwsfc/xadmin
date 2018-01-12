# 全新的Xadmin

xadmin3.0版本已经完全重写，完全变成了一个纯前端框架。全新的xadmin使用React和Redux套餐，保持了xadmin原有的高扩展性和高定制性，让您可以轻松定制出一整套管理后台。后端数据全部采用API方式获取，您可以定制自己的API Client对接您的后台系统。

```
使用xadmin老版本的同学，可使用 django-rest-framework 这个django自动生成RESTful API神奇对接xadmin。xadmin官方也会在近期推出专门针对django的接口。其他语言框架的接口也会陆续推出
```

## 文档

一如既往的编写中...

## 安装

首先您需要安装 node 和 npm， 在你的项目目录下执行

```
npm i --save xadmin-start
```

xadmin其实由很多个包组成，用户可以根据自己的需要选择安装，xadmin-main 包是一个集成了所有常用功能包，您也可以自己定制安装，xadmin的包目前如下：

| Package | Version | Docs | Description |
|---------|---------|------|-------------|
|xadmin-core|1.0.2||xadmin核心模块|
|xadmin-i18n|1.0.2||i18n国际化功能模块|
|xadmin-layout|1.0.2||xadmin布局模块|
|xadmin-form|1.0.2||xadmin表单模块|
|xadmin-model|1.0.2||xadmin模型模块|
|xadmin-auth|1.0.2||xadmin用户权限模块|
|xadmin-plugins|1.0.2||xadmin常用插件|

您可以根据自己的需要选择安装模块。

## 开始实例

使用xadmin非常简单，本直接运行在在线JS运行器中即可看到效果。

``` js
import app from 'xadmin-start'
import api from 'xadmin-api-jsonplaceholder'

app
.use({
  config: { title: 'Xadmin Demo', api },
  model: {
    User: {
      name: 'user',
      resource_name: 'users',
      type: 'object',
      icon: 'user', // fa-icon
      title: 'User',
      properties: {
        id: {
          type: 'number',
          title: 'User ID'
        },
        name: {
          type: 'string'
        },
        username: {
          type: 'string'
        },
        email: {
          type: 'string',
          format: 'email'
        },
        website: {
          type: 'string'
        },
        address: {
          type: 'object',
          properties: {
            street: { type: 'string' },
            suite: { type: 'string' }
          }
        }
      },
      permission: { view: true, add: true, edit: true, delete: true },
      form: [ 'id', 'name', 'email', 'website', 'address' ],
      filters: {
        nav: [ 'name', 'email' ],
        sidemenu: [ 'name' ]
      },
      search_fields: [ 'name', 'email' ],
      required: [ 'name', 'email', 'website' ],
      readonly: [ 'id' ],
      list_display: [ 'id', 'name', 'email', 'website', 'address.street' ]
    }
  }
})
.start({ container: '#app' })

```

## 核心思想

### 模块化

### Wrap高阶组件

### Block占位模块

### 模型

## 发布日志

## License

Xadmin is MIT licensed.