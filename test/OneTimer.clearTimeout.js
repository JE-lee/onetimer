let assert = require('assert')
let OneTimer = require('../src/OneTimer')
let _ = require('lodash')

function sleep(ms) {
  let start = Date.now()
  // eslint-disable-next-line no-empty
  while (Date.now() - start <= ms) { }
}

// compare two array in the precision of ±1ms
function compare(checkList, expectedList, precision = 1) {
  if (checkList.length != expectedList.length) return false
  return checkList.reduce((result, curVal, curIndex) => {
    let expected = expectedList[curIndex]
    return result && _.inRange(curVal, expected - precision, expected + precision)
  }, true)
}

describe('OneTimer.clearTimeout', function(){
  it('clearTimeout1', function(done){
    let deltaList = [50,53,68,72,62,85,100,120,145],
      timer = new OneTimer(),
      output = [],
      timers = deltaList.map(delta => timer.setTimeout(() => output.push(delta), delta))
    
    // clearTimeout
    timer.clearTimeout(timers[0])
    timer.setTimeout(() => output.push(90), 90)
    timer.setTimeout(() => output.push(200), 200)
    timer.on('done', () => {
      let expects = deltaList.concat([90,200]).sort((a, b) => a - b).slice(1)
      assert.ok(expects.join(',') == output.join(','), 'not equal')
      done()
    })
  })
  it('clearTimeout2', function (done) {
    let deltaList = [50, 53, 68, 72, 62, 85, 100, 120, 145],
      timer = new OneTimer(),
      output = [],
      // eslint-disable-next-line no-unused-vars
      timers = deltaList.map(delta => timer.setTimeout(() => output.push(delta), delta))

    // clearTimeout
    timer.setTimeout(() => output.push(200), 200)
    timer.clearTimeout(timer.linkedline[timer.linkedline.length - 1])
    timer.setTimeout(() => output.push(90), 90)

    timer.on('done', () => {
      let expects = deltaList.concat([90, 200]).sort((a, b) => a - b).slice(0,-1)
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
    timer.setTimeout(() => output.push(90), 90)
    timer.setTimeout(() => output.push(200), 200)
    timer.on('done', () => {
      deltaList.splice(clearIndex,1)
      let expects = deltaList.concat([90, 200]).sort((a, b) => a - b)
      assert.ok(expects.join(',') == output.join(','), 'not equal')
      done()
    })
  })
  it('clearTimout 4', function(done){
    this.timeout(0)
    let output = [], ids = []
    let timer = new OneTimer()
    timer.clearTimeout(timer.setTimeout(() => done('error 10'), 10))
    
    let list = [80,120,70,140,160, 75, 98,111]
    list.forEach(delay => ids.push(timer.setTimeout(() => output.push(delay), delay)))

    timer.once('timeout', delay => assert.ok(_.inRange(delay, 75 - 1, 75 + 1)))
    // clear head
    timer.clearTimeout(ids[2])


    let fn = () => done('it should not restart timer')
    // clear middle
    timer.on('timeout', fn)
    timer.clearTimeout(ids[1])
    // clear tail
    timer.clearTimeout(ids[4])

    timer.off('timeout', fn)
    let deltas = timer.linkedline.map(n => n.delta).slice(0, -1)
    console.log('deltas', deltas)
    assert.ok(compare(deltas,[5,18,13,29] ,1.5), 'not eaqual deltas')
    done()
  })
  it('clearTimeout7', function (done) {
    let timer = new OneTimer()
    timer.setTimeout(() => {
      console.log('done 1')
    }, 100)

    let id = timer.setTimeout(() => {
      console.log('done 2')
      timer.clearTimeout(id)
    }, 200)

    timer.setTimeout(() => {
      console.log('done 3')
      done()
    }, 300)
  })
})