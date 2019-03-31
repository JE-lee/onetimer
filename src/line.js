import Node from './node'
import * as singlie from 'singlie' 

export default class{
  constructor(){
    this.line = new singlie.Linear()
  }
  InWhichIndex(node){
    // 二分查找index
    let id = node.id,
      high = this.line.length - 1,
      low = 0
    while(high > low){
      let middle = Math.ceil((high - low) / 2 + low),
        middleId = this.line.get(middle).id
      if(middleId > id){
        high = middle
      }else if(middleId < id){
        low = middle 
      }else {
        return middle 
      }
    }
    return high 
  },
  push(delta){
    let _delta = Number(delta) >= 0 ? Number(delta) : 0,
      id = Date.now() + _delta
    this.line
  }
}