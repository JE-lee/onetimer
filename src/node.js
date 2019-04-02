module.exports = class {
  constructor(id){
    this.id = id || Date.now()
    this.callbacks = [] 
    this.delta = 0
  }
  get callback(){
    return () => {
      // synchronous execution 
      this.callbacks.forEach(callback => callback())
    }
  }
}