import OneTimer from '../src/OneTimer'
import _ from 'lodash'

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
describe('line', function(){
  this.timeout(0)
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

})