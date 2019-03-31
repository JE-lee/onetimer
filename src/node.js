export default class {
  constructor(id){
    this.id = id 
    this.callbacks = []
    this.delta = 0
  }
  compare(node){
    return node.id - this.id
  }

}