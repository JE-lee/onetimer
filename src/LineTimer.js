import Node from './node'
//const singlie = require('singlie')
//const EventEmitter = require('wolfy87-eventemitter')
import { Linear } from 'singlie'
import EventEmitter from 'wolfy87-eventemitter'

class LineTimer{
  constructor(){
    this.line = new Linear()
    this.onlyTimer = null
  }
  InWhichIndex(node){
    // half-interval search
    let id = node.id,
      high = this.line.length - 1,
      low = 0,
      ret = 0
    while(high > low){
      let middle = Math.ceil((high - low) / 2 + low),
        middleId = this.line.get(middle).id
  
      if(middleId > id){
        ret = high = middle - 1
        if(this.line.get(high).id < id) break
      }else if(middleId < id){
        ret = low = middle 
      }else {
        break
      }

    }
    if(this.line.isEmpty()) return 0
    return this.line.get(ret).id - id > 0 ? ret : (ret + 1) 
  }
  push(delay, callback){
    let _delay = Number(delay) >= 0 ? Number(delay) : 0,
      id = Date.now() + _delay,
      node = new Node(id),
      isEmpty = this.line.isEmpty()
    
    // init callbacks
    node.callbacks = callback instanceof Array ? callback : [callback]
    // find out where to insert
    let index = this.InWhichIndex(node)
    this.line.insert({ value: node, index })
    // recompucate the delta of insert node and prev node
    let insertNode = this.line.node(index),
      prevNode = this.line.node(index - 1 ),
      nextNode = insertNode.next

    prevNode && (prevNode.value.delta = insertNode.value.id - prevNode.value.id)
    nextNode && (insertNode.value.delta = nextNode.value.id - insertNode.value.id)
    // start the timer when the linked list is empty before insertting node 
    isEmpty && this.startTimer(delay)
  }
  startTimer(delay){
    let line = this.line
    this.onlyTimer = setTimeout(() => {
      let delta = line.head.delta 
      // execute callback
      line.head.callback()
      // remove the linked list head
      line.remove(0)
      // stop the line-timer 
      if (line.isEmpty()) {
        this.emitEvent('done')
        return 
      } 
      // start again
      this.startTimer(delta)
    }, delay)
  }
}

// inherit EventEmitter
Object.assign(LineTimer.prototype, EventEmitter.prototype)

export default LineTimer