// 来源：https://github.com/trekhleb/javascript-algorithms/blob/master/src/data-structures/linked-list/LinkedListNode.js

export default class LinkedListNode {
  constructor(value, next = null) {
    this.value = value
    this.next = next
  }

  toString(callback) {
    return callback ? callback(this.value) : `${this.value}`
  }
}
