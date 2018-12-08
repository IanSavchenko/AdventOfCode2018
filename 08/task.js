let _ = require('lodash');
let fs = require('fs');
let util = require('../util');

// INPUT PROCESSING
let data = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();
let inp = data.split(' ').map(val => +val);

// PART 1
let part1 = 0;

let parseTree = (arr) => {
  let node = {
    ch: [],
    meta: [],
    val: 0
  };

  let chCnt = arr[0];
  let metaCnt = arr[1];
  let metaPos = 2;
  for(let i = 0; i < chCnt; i++) {
    let {
      node: child,
      cnt
    } = parseTree(arr.slice(metaPos));

    node.ch.push(child);
    metaPos += cnt;
  }

  for (let i = metaPos; i < metaPos+metaCnt; i++) {
    node.meta.push(arr[i]);
    part1 += arr[i];
  }

  if (!node.ch.length) {
    node.val = _.sum(node.meta);
  } else {
    node.val = _.chain(node.meta).map(i => {
      if (i === 0 || i > chCnt) {
        return 0;
      }

      return node.ch[i - 1].val;
    }).sum().value();
  }

  return {
    node,
    cnt: metaPos + metaCnt
  };
};

let root = parseTree(inp);
console.assert(root.cnt === inp.length);

console.log(`Part 1: ${part1}`);
console.assert(part1 === 43351);

// PART 2
let part2 = root.node.val;

console.log(`Part 2: ${part2}`);
console.assert(part2 === 21502);