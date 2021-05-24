## 前言
由于这个月时间有点紧迫，而且实现的3d技术是从零开始学的，目前实现的数据结构只有四个，但是经历这段时间的学习和实践，已经能够比较熟练的实现大部分数据结构的动画效果了，还请老师能够给个通过初赛的机会，在决赛开始前的时间，肯定能够完善更多的更复杂数据结构，比如红黑树、B树、B+树、图等。

在线预览：https://yukee-798.github.io/data-structure-visualization/
github仓库：https://github.com/Yukee-798/data-structure-visualization/tree/master

## 项目结构
```
|-- public
|-- src
    |-- api 规范请求格式
    |-- assets 静态资源文件
    |-- components 封装页面通用组件
    |-- pages 组件的容器，同时对应路由下的页面
    |-- configs 页面配置
    |-- types 存放全局复用的 type
    |-- utils 封装通用函数、hooks
```

## 技术栈
* TypeScript
* node.js
* react
* react-spring 动画库
* react-three-fiber 构建 3d 模型
* antd UI库

## 功能介绍

### 主页
![](https://tva1.sinaimg.cn/large/008i3skNgy1gqtq893nbrj32520rqtzx.jpg)

### 数据结构详情页
#### 排序
![](https://tva1.sinaimg.cn/large/008i3skNgy1gqtqbjv6o7j31is0u07fx.jpg)
![](https://tva1.sinaimg.cn/large/008i3skNgy1gqtqgohc7uj31lb0u07gq.jpg)
你可以对数据结构的显示区域进行任意缩放和环绕查看。
![](https://tva1.sinaimg.cn/large/008i3skNgy1gqtqaxekhgj31ir0u0k29.jpg)
目前支持冒泡、选择、快速排序，另外还可以对数组进行添加和删除元素，同时控制台可以显示操作详情。
![](https://tva1.sinaimg.cn/large/008i3skNgy1gqtqev11hej312a0c6jsf.jpg)

#### 栈
![](https://tva1.sinaimg.cn/large/008i3skNgy1gqtqh87t4oj31j40u0dof.jpg)
你可以随机生成一个栈，并且对其进行弹栈、压栈数据操作。
![](https://tva1.sinaimg.cn/large/008i3skNgy1gqtqi3vuyoj31il0u0gut.jpg)
你的所有操作过程都会记录在控制台中。

#### 队列
![](https://tva1.sinaimg.cn/large/008i3skNgy1gqtqixwt7oj31jj0u0dnp.jpg)
支持对队列进行入队、出队数据操作，你的所有操作过程都会记录在控制台中。

#### 二叉搜索树
![](https://tva1.sinaimg.cn/large/008i3skNgy1gqtqkcztvwj31i00u0dpl.jpg)
你可以随机生成一个二叉搜索树，目前支持二叉树的三种遍历方式：前序、中序、后序。

