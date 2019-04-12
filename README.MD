思考如下问题:
当我们需要延迟执行代码，这种情况一多，我们就需要同时创建很多个定时器。当我们的页面同时持有很多定时器的时候，这会耗费很多不必要的计算机资源。
```javascript
setTimeout(() => {}, 100)
setTimeout(() => {}, 200)
setTimeout(() => {}, 300)
setTimeout(() => {}, 400)
setTimeout(() => {}, 500)
...
```

试想，我们是否可以只使用一个定时器来完成上述的逻辑，也就是说我们只需要依次设置一个100ms的定时器，在前一个定时器完成后，才设置下一个定时器。
```javascript
setTimeout(() => {
  setTimeout(() => {
    setTimeout(() => {
      ...
    }, 300- 200)
  },200 - 100)
},100)
```

OneTimer最终完成的事情就是这个。
```javascript
npm i --save one-timer

import OneTimer from 'one-timer/dist/OneTimer.es.js'

let oneTimer = new OneTimer()
oneTimer.push(100, () => {})
oneTimer.push(200, () => {})
oneTimer.push(300, () => {})
oneTimer.push(400, () => {})
oneTimer.push(500, () => {})
...
```
如上，不管你需要执行多少个定时逻辑，持有的定时器永远只有一个。