// 来源：https://github.com/trekhleb/javascript-algorithms/blob/master/src/data-structures/linked-list/LinkedList.js

import LinkedListNode from './LinkedListNode'
import Comparator from '../utils/Comparator'

export default class LinkedList {

  /**
   *
   * @param {Function} comparatorFunction
   */
  constructor(comparatorFunction) {
    this.head = null
    this.tail = null
    this.compare = new Comparator(comparatorFunction)
  }

  /**
   *
   * @param {*} value
   * @returns {LinkedList}
   */
  prepend(value) {
    this.head = new LinkedListNode(value, this.head)

    return this
  }

  /**
   *
   * @param {*} value
   * @returns {LinkedList}
   */
  append(value) {
    const newNode = new LinkedListNode(value)

    if (!this.head) {
      this.head = newNode
      this.tail = newNode

      return this
    }

    this.tail.next = newNode
    this.tail = newNode

    return this
  }

  /**
   *
   * @param {*} value
   * @returns {LinkedList}
   */
  delete(value) {
    if (!this.head) {
      return null
    }

    let deleteNode = null

    if (this.compare.equal(this.head.value, value)) {
      deleteNode = this.head
      this.head = this.head.next
    }

    let currentNode = this.head

    if (currentNode !== null) {
      while (currentNode.next) {
        if (this.compare.equal(currentNode.next.value, value)) {
          deleteNode = currentNode.next
          currentNode.next = currentNode.next.next
        } else {
          currentNode = currentNode.next
        }
      }
    }

    if (this.compare.equal(this.tail.value, value)) {
      this.tail = currentNode
    }

    return deleteNode
  }

  /**
   *
   * @param {Object} findParams
   * @param {*} findParams.value
   * @param {Function} findParams.callback
   * @returns {LinkedListNode}
   */
  find({
    value = void 0,
    callback = void 0
  }) {
    if (!this.head) {
      return null
    }

    let currentNode = this.head

    while (currentNode) {
      if (callback && callback(currentNode.value)) {
        return currentNode
      }

      if (value !== void 0 && this.compare.equal(currentNode.value, value)) {
        return currentNode
      }

      currentNode = currentNode.next
    }

    return null
  }

  /**
   * @returns {LinkedListNode}
   */
  deleteTail() {
    if (this.head === this.tail) {
      const deletedTail = this.tail
      this.head = null
      this.tail = null

      return deletedTail
    }

    const deletedTail = this.tail
    let currentNode = this.head
    while (currentNode.next) {
      if (!currentNode.next.next) {
        currentNode.next = null
      } else {
        currentNode = currentNode.next
      }
    }

    this.tail = currentNode
    return deletedTail
  }
  /**
   * @returns {LinkedListNode}
   */
  deleteHead() {
    if (!this.head) {
      return null
    }

    const deleteHead = this.head

    if (this.head.next) {
      this.head = this.head.next
    } else {
      this.head = null
      this.tail = null
    }

    return deleteHead
  }

  /**
   * @returns {LinkedListNode[]}
   */
  toArray() {
    const nodes = []

    let currentNode = this.head
    while (currentNode) {
      nodes.push(currentNode)
      currentNode = currentNode.next
    }

    return nodes
  }

  /**
   *
   * @param {Function} callback
   * @returns {string}
   */
  toString(callback) {
    return this.toArray.map(node => node.toString(callback).toString())
  }
}
