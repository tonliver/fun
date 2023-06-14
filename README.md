# 一些有趣的小demo(不断补充中)

* 汉诺塔
* 防抖 & 节流

# 代码结构
```
|- src
  |- components
    |- logger.vue         日志显示面板
  |- views
    |- hanoi              汉诺塔
      |- index.vue        UI
      |- TowerOfHanoi.ts  汉诺塔逻辑处理类
    |- debounce-throttle  防抖与节流示例
      |- index.vue
  |- utils
    |- debounce.ts  防抖函数
    |- throttle.ts  节流函数
|- tests
  |- unit
    |- utils
      |- debounce.spec.ts 防抖函数单测
      |- throttle.spec.ts 节流函数单测
```

## 使用
```
npm i
npm run serve
```