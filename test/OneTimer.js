const OneTimer = require('../src/OneTimer')
const _ = require('lodash')
const assert = require('assert')



const testOutputOrder = (done, deltaList) => {
  const generateFn = word => () => list.push(word)
  let line = new OneTimer()
  let list = []
  deltaList.forEach(delta => {
    line.push(delta, generateFn(delta))
  })
  line.on('done', () => {
    let expected = deltaList.sort((a, b) => a - b).join(',')
    // eslint-disable-next-line no-console
    console.log('expected', expected)
    assert.equal(list.join(','), expected, 'not equal')
    done()
  })
}

const testDelta = (deltaList, done) => {
  let timer = new OneTimer(),
    deltas = [],
    fn = delay => timer.push(delay, () => { })

  let list = deltaList,
    expectedDeltaList = list.sort((a, b) => a - b).reduce((detals, item, curIndex) => {
      if (curIndex == 0) {
        detals.push(item)
        return detals
      }
      detals.push(item - list[curIndex - 1])
      return detals
    }, [])
  timer.on('timeout', delta => deltas.push(delta))
  timer.on('done', () => {
    // eslint-disable-next-line no-console
    console.log('deltas', deltas)
    // eslint-disable-next-line no-console
    console.log('expectedDeltaList', expectedDeltaList)
    assert.ok(compare(deltas, expectedDeltaList, 2), 'not equal')
    done()
  })
  list.forEach(delta => fn(delta))
}


function sleep(ms) {
  let start = Date.now()
  // eslint-disable-next-line no-empty
  while (Date.now() - start <= ms) { }
}
// compare two array in the precision of ±1ms
function compare(checkList, expectedList, precision = 1){
  if (checkList.length != expectedList.length) return false 
  return checkList.reduce((result, curVal, curIndex) => {
    let expected = expectedList[curIndex]
    return result && _.inRange(curVal, expected - precision, expected + precision)
  }, true)
}

// default timeout is 2000ms
describe('line', function(){
  it('#test delta', function (done) {
    let list1 = [0, 10, 20, 30, 30, 30, 40, 50, 60, 50, 70]
    testDelta(list1, () => { })

    // random
    testDelta(Array(10).fill('').map(() => _.random(500)), () => { })

    let list2 = [300, 50, 1000, 0, 20, 90, 10, 20, 80]
    testDelta(list2, done)

  })
  it('#test Output Order', (done) => {
    let list1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    testOutputOrder(() => { }, list1)

    let list2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].reverse().map((delta, i) => delta + i * 10)
    testOutputOrder(() => {}, list2)

    let list3 = Array(10).fill(1).map(() => _.random(500))
    testOutputOrder(() => { }, list3)

    let list4 = [0, 1, 2, 3, 3, 3, 3, 4, 5, 6]
    testOutputOrder(() => { }, list4)

    let list5 = [70, 0, 10, 20, 30, 30, 30, 30, 40, 800,50, 60]
    testOutputOrder(done, list5)
  })

  it('#test4', function(done){
    this.timeout(1500)
    let timer = new OneTimer(),
      result = [],
      deltas = [],
      fn = (delay, wait) => {
        setTimeout(() => timer.push(delay, () => result.push(delay)), wait)
      }

    let list = Array(5).fill('').map(() => _.random(50,100))
  
    timer.on('timeout', delay => deltas.push(delay))
    list.forEach(d => fn(d, Math.ceil(d/10)) )
    setTimeout(() => {
      // eslint-disable-next-line no-console
      assert.ok(compare(result, list.sort((a, b) => a - b), 2), 'done not eqaul')
      // deltas
      let expectedDelta = list.reduce((res, cur, curIndex) => {
        if (curIndex == 0) {
          res.push(cur)
          return res
        }
        res.push(cur - list[curIndex - 1] + Math.ceil(cur / 10) - Math.ceil(list[curIndex - 1] / 10))
        return res
      }, [])
      // eslint-disable-next-line no-console
      console.log('expectedDelta', expectedDelta)
      // eslint-disable-next-line no-console
      console.log('deltas', deltas)
      assert.ok(compare(deltas, expectedDelta, 2), 'done not equal delta')
      done()
    }, 1400)
  })

  it('#test sleep', function(done){
    let start = Date.now()
    sleep(30)
    let delta = Date.now() - start
    assert.ok(_.inRange(delta, 30 - 1, 30 + 1.1), 'not equal 30')
    done()
  })

  // test start timer
  it('#test start timer', function(done){
    this.timeout(0)
    let timer = new OneTimer()
    const precision = 1.5
    const delay1 = 500
    timer.once('timeout', delay => assert.ok(_.inRange(delay1, delay - precision, delay + precision)))
    // eslint-disable-next-line no-console
    timer.setTimeout(() => console.log(`callback ${delay1}`), delay1)

    sleep(20)
    const delay2 = 200
    timer.once('timeout', delay => assert.ok(_.inRange(delay2, delay - precision, delay + precision)))
    // eslint-disable-next-line no-console
    timer.setTimeout(() => console.log(`callback ${delay2}`), delay2)
    let delay1List = timer.linkedline.map(n => n.delta).slice(0,-1)
    // eslint-disable-next-line no-console
    console.log('delay1List', delay1List)
    assert.ok(compare(delay1List, [delay1 - 20 - delay2], 2), 'delta not correct 1')


    sleep(50) 
    const delay3 = 1000
    let call3 =  () => done('it should not restart timer')
    timer.on('timeout', call3)
    timer.setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log(`callback ${delay3}`)
      done()
    }, delay3)
    timer.off(/timeout/, call3)
    let delay2List = timer.linkedline.map(n => n.delta).slice(0, -1)
    // eslint-disable-next-line no-console
    console.log('delay2List', delay2List)
    assert.ok(compare(delay2List, [delay1 - 20 - delay2, 20 + 50 + delay3 - delay1 ], 8), 'delta not correct 2')

  })
})