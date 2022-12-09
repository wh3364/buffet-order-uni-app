# 不饿了自助点餐微信小程序(暂定)

### 项目介绍

本项目基于springboot，uniapp 前后端分离开发

- 后端主要技术：springboot，mybatis，redis，rabbitmq
  ​	地址：[BuffetOrderSpringboot: 这是一个自助点餐系统的后端 (gitee.com)](https://gitee.com/fchgit/buffet-order-springboot)

- 微信小程序：uniapp
  ​	地址：[BuffetOrderUniApp: 这是一个基于uniapp的微信自助点餐小程序 (gitee.com)](https://gitee.com/fchgit/buffet-order-uni-app)

- 管理员端：vue, element-ui
  ​	地址：[BuffetOrderAdmin: 这是一个自助点餐小程序的管理页面 (gitee.com)](https://gitee.com/fchgit/buffet-order-admin)

#### 效果图:  

##### 	微信小程序:
<div align=center>
    <img src="https://gitee.com/fchgit/buffet-order-springboot/raw/master/%E5%9B%BE/%E6%95%88%E6%9E%9C%E5%9B%BE/wx-1.png" width="300"/>    <img src="https://gitee.com/fchgit/buffet-order-springboot/raw/master/%E5%9B%BE/%E6%95%88%E6%9E%9C%E5%9B%BE/wx-2.png" width="300"/>
</div>

<div align=center>
    <img src="https://gitee.com/fchgit/buffet-order-springboot/raw/master/%E5%9B%BE/%E6%95%88%E6%9E%9C%E5%9B%BE/wx-3.png" width="300"/>    <img src="https://gitee.com/fchgit/buffet-order-springboot/raw/master/%E5%9B%BE/%E6%95%88%E6%9E%9C%E5%9B%BE/wx-4.png" width="300"/>
</div>

##### 	管理员端:
<div align=center>
    <img src="https://gitee.com/fchgit/buffet-order-springboot/raw/master/%E5%9B%BE/%E6%95%88%E6%9E%9C%E5%9B%BE/admin-1.png" width="600"/>
</div>

<div align=center>
    <img src="https://gitee.com/fchgit/buffet-order-springboot/raw/master/%E5%9B%BE/%E6%95%88%E6%9E%9C%E5%9B%BE/admin-2.png" width="600"/>
</div>

### 项目部署

1. 下载[HBuilderX](https://dcloud.io/hbuilderx.html)与[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)并安装
2. 用HBuilderX打开项目
3. HBuilderX - 运行 - 运行到小程序模拟器 - 微信开发者工具 - 完成

### 特性/功能

- 待补充

### 项目结构

``` 
.
│  App.vue
│  index.html
│  main.js
│  manifest.json
│  pages.json
│  uni.scss
│      
├─.vite
│  └─deps
│          package.json
│          
├─common
│  │  api.js
│  │  countdown.js
│  │  global.css
│  │  uni-nvue.css
│  │  uni.css
│  │  
│  └─request
│          food.js
│          order.js
│          user.js
│          
├─pages
│  ├─index
│  │      index.vue
│  │      
│  ├─orderDetail
│  │      index.vue
│  │      
│  ├─settle
│  │      index.vue
│  │      
│  └─tabBar
│      ├─myInfo
│      │      index.vue
│      │      
│      ├─orderForm
│      │      index.vue
│      │      
│      └─orderMeal
│              index.vue
│              
├─static
│  │  logo.png
│  │  
│  └─img
│      └─icon
│              ...
│              
├─store
│  │  getters.js
│  │  index.js
│  │  
│  └─modules
│          cart.js
│          user.js
│          
├─uni_modules
```

### 注意事项
- 暂无

### 接下来的开发
- 无