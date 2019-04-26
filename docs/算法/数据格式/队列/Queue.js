// 来源：https://github.com/trekhleb/javascript-algorithms/blob/master/src/data-structures/queue/Queue.js

import LinkedList from '../链表/LinkedList'

export default class Queue {
  constructor() {
    this.linkedList = new LinkedList()
  }

  isEmpty() {
    return !this.linkedList.tail
  }

  peek() {
    if (!this.linkedList.head) {
      return null
    }

    return this.linkedList.head.value
  }

  enqueue(value) {
    this.linkedList.append(value)
  }

  dequeue() {
    const removeHead = this.linkedList.deleteHead()
    return removeHead ? removeHead.value : null
  }

  toString(callback) {
    return this.linkedList.toString(callback)
  }
}
