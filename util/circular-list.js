let _ = require('lodash');

class CircularList {
  constructor() {
    this.cur = undefined;
  }

  moveRight(steps = 1) {
    _.times(steps, () => this.cur = this.cur.next);
  }

  moveLeft(steps = 1) {
    _.times(steps, () => this.cur = this.cur.prev);
  }

  insert(val) {
    if (this.cur === undefined) {
      this.cur = {
        val,
        next: undefined,
        prev: undefined
      };
  
      this.cur.next = this.cur;
      this.cur.prev = this.cur;
      return;
    }

    let {next} = this.cur;
    let ins = {
      val,
      next,
      prev: this.cur
    };

    this.cur.next.prev = ins;
    this.cur.next = ins;
    this.cur = this.cur.next;
  }

  remove() {
    if (this.cur === this.cur.next) {
      this.cur = undefined;
      return;
    }

    this.cur.prev.next = this.cur.next;
    this.cur.next.prev = this.cur.prev;
    this.cur = this.cur.next;
  }
}

module.exports = CircularList;