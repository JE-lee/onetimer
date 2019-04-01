import LineTimer from '../src/LineTimer'

const assert = require('assert')
let list = []
const generateFn = word => () => list.push(word)

describe('line', function(){
  this.timeout(0)
  it('#test1', (done) => {
    // Whether it works
    let line = new LineTimer()
    list = []
    line.push(0, generateFn(0)) 
    line.push(1, generateFn(1))
    line.push(2, generateFn(2)) 
    line.push(3, generateFn(3))
    line.push(4, generateFn(4))
    line.push(5, generateFn(5))
    line.push(6, generateFn(6))
    line.push(7, generateFn(7))
    line.on('done', () => {
      assert.equal(list.sort((a, b) => a - b).join(''), '01234567', '不相等')
      done()
    })
  })
  it('#test2', (done) => {
    // Whether it works
    let line = new LineTimer()
    list = []
    line.push(7, generateFn(7))
    line.push(6, generateFn(6))
    line.push(5, generateFn(5))
    line.push(4, generateFn(4))
    line.push(3, generateFn(3))
    line.push(2, generateFn(2))
    line.push(1, generateFn(1))
    line.push(0, generateFn(0))
    line.on('done', () => {
      assert.equal(list.sort((a,b) => a - b ).join(''), '01234567', '不相等')
      done()
    })
  })
})