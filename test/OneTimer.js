//import OneTimer from '../src/OneTimer'
//import _ from 'lodash'
const OneTimer = require('../src/OneTimer')
const _ = require('lodash')

const assert = require('assert')
let list = []
const generateFn = word => () => list.push(word)
const test = (done, deltaList) => {
  let line = new OneTimer()
  list = []
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
  //this.timeout(0)
  it('#test1', (done) => {
    let list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    test(done,list)
  })
  it('#test2', (done) => {
    // Whether it works
    let list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].reverse().map((delta, i) => delta + i * 10)
    test(done, list)
  })
  it('#test3', (done) => {
    // Whether it works
    let list = Array(10).fill(1).map(() => _.random(500))
    test(done, list)
  })
  it('#test4', function(done){
    let timer = new OneTimer(),
      result = [],
      doneCount = 0,
      fn = delay => {
        setTimeout(() => {
          timer.push(delay, () => result.push(delay))
        }, delay)
      }
    
    timer.on('done', () => {
      doneCount ++ 
      if(doneCount === 3) done()
    })
    timer.on('timeout', delay => {
      if (![1, 10, 100].filter(d => d == delay)) done(`incorrect delay setting: ${delay}`)
    })
    fn(1)
    fn(10)
    fn(100)
  })
  it('#test5', function(done) {
    let timer = new OneTimer(),
      deltas = [],
      fn = delay => timer.push(delay, () => {})
    
    let list = Array(10).fill('').map(() => _.random(500)),
      expectedDeltaList = list.sort((a, b) => a - b).reduce((detals, item, curIndex) => {
        if(curIndex == 0){
          detals.push(item)
          return detals
        }
        detals.push(item - list[curIndex - 1])
        return detals 
      },[])
    timer.on('timeout', delta => deltas.push(delta))
    timer.on('done', () => {
      // eslint-disable-next-line no-console
      console.log('deltas', deltas)
      // eslint-disable-next-line no-console
      console.log('expectedDeltaList', expectedDeltaList)
      assert.ok(compare(deltas, expectedDeltaList,2), 'not equal')
      done()
    })
    list.forEach(delta => fn(delta))
    
    
  })
  it('#test6', function(done){
    let list = [0,1,2,3,3,3,3,4,5,6]
    test(done, list)
  })
  it('#test7', function (done) {
    let list = [0, 10, 20, 30, 30, 30, 30, 40, 50, 60]
    test(done, list)
  })
})