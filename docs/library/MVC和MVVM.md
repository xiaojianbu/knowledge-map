# MVC 和 MVVM

## MVC

model：数据保存

view：视图

controller: 业务逻辑

view 传送指令到 controller,controller 完成业务逻辑后，要求 model 改变状态，model 将新的数据发送到 view

## MVVM

view 与 model 不发生联系，通过 ViewModel 传递

ViewModel 采用双向绑定： view 的变动，自动反应到 ViewModel,反之一样。

Model 层是数据层，它只关心数据本身，不关心数据如何操作和展示；View 是视图层，负责将数据模型转化为 UI 展现给用户；ViewModel 为视图提供引擎，用来处理业务逻辑。
