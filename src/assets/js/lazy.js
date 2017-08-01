/* Lazy
 * 
 * [usage]
 * 
 *   // define Lazy value inside function
 *   const test = new Lazy(() => 5)
 *   
 *   // get Lazy value (result is cached)
 *   console.log(test.value)
 * 
 */

export default class Lazy {
  constructor (fn, cached=true) {
    this.fn = fn
    this.cached = cached
  }
  get value () {
    if (this.cached && this.__value__ !== undefined) {
      return this.__value__
    } else {
      return this.__value__ = this.fn()
    }
  }
}
