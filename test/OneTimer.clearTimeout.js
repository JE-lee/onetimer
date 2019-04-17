let assert = require('assert')
let OneTimer = require('../src/OneTimer')

describe('OneTimer.clearTimeout', function(){
  it('clearTimeout1', function(done){
    let deltaList = [50,53,68,72,62,85,100,120,145],
      timer = new OneTimer(),
      output = [],
      timers = deltaList.map(delta => timer.setTimeout(() => output.push(delta), delta))
    
    // clearTimeout
    timer.clearTimeout(timers[0])
    timer.on('done', () => {
      let expects = deltaList.sort((a, b) => a - b).slice(1)
      assert.ok(expects.join(',') == output.join(','), 'not equal')
      done()
    })
  })
  it('clearTimeout2', function (done) {
    let deltaList = [50, 53, 68, 72, 62, 85, 100, 120, 145],
      timer = new OneTimer(),
      output = [],
      timers = deltaList.map(delta => timer.setTimeout(() => output.push(delta), delta))

    // clearTimeout
    timer.clearTimeout(timers[deltaList.length - 1])
    timer.on('done', () => {
      let expects = deltaList.sort((a, b) => a - b).slice(0,deltaList.length - 1)
      assert.ok(expects.join(',') == output.join(','), 'not equal')
      done()
    })
  })
  it('clearTimeout3', function (done) {
    let deltaList = [50, 53, 68, 72, 62, 85, 100, 120, 145],
      timer = new OneTimer(),
      output = [],
      timers = deltaList.map(delta => timer.setTimeout(() => output.push(delta), delta))

    // clearTimeout
    let clearIndex = 2
    timer.clearTimeout(timers[clearIndex])
    timer.on('done', () => {
      deltaList.splice(clearIndex,1)
      let expects = deltaList.sort((a, b) => a - b)
      console.log('expects', expects.join(','))
      console.log('output', output.join(','))
      assert.ok(expects.join(',') == output.join(','), 'not equal')
      done()
    })
  })
})