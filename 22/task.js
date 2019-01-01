let _ = require('lodash');
let fs = require('fs');
let util = require('../util');

// INPUT PROCESSING
let data = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();
data = util.splitLines(data);
let depth = +data[0].split(' ')[1];
let tgt = data[1].split(' ')[1].split(',');
tgt = {
  x: +tgt[0],
  y: +tgt[1]
};

// PART 1
let size = {
  x: tgt.x + 100,
  y: tgt.y + 100
};

let erosionMemo = util.arr2dInit(size.y, size.x, null);
let erosion = function(x, y) {
  if (erosionMemo[y][x] !== null) {
    return erosionMemo[y][x];
  }

  erosionMemo[y][x] = (gi(x, y) + depth) % 20183;
  return erosionMemo[y][x];
};

let gi = function(x, y) {
  if (y === 0) {
    return x * 16807;
  } else if (x === 0) {
    return y * 48271;
  } else if (x === tgt.x && y === tgt.y) {
    return 0;
  } else {
    return erosion(x - 1, y) * erosion(x, y - 1);
  }
};

let risk = util.arr2dInit(size.y, size.x);
util.arr2dForEach(risk, (val, y, x) => {
  risk[y][x] = erosion(x, y) % 3;
});

risk[0][0] = 'M';
risk[tgt.y][tgt.x] = 'T';

let part1 = 0;
util.arr2dForEach(risk, (val) => {
  if (_.isNumber(val)) {
    part1 += val;
  }
}, 0, 0, tgt.y + 1, tgt.x + 1);

console.log(`Part 1: ${part1}`);
console.assert(part1 === 5637);

// PART 2
let dirs = [
  {x: -1, y: 0},
  {x: 1, y: 0},
  {x: 0, y: -1},
  {x: 0, y: 1}
];

let getTools = function(type) {
  switch(type) {
  case 0:
    return ['c', 't'];
  case 1: 
    return ['c', 'n'];
  case 2: 
    return ['t', 'n'];
  case 'M':
  case 'T':
    return ['t'];
  default:
    throw new Error('unknown type');
  }
};

let processedIds = new Set();
let nodes = new Map();

let startNode = {
  y: 0,
  x: 0,
  tool: 't',
  id: '0 0 t',
  dist: 0
};
nodes.set(startNode.id, startNode);

let tgtId = `${tgt.x} ${tgt.y} t`;
let q = [startNode];
while (q.length) {
  q.sort(function(a, b) {
    return a.dist - b.dist;
  });

  let {
    x,
    y,
    tool,
    id,
    dist
  } = q.shift();

  let tools = getTools(risk[y][x]);
  for(let d of dirs) {
    let nX = x + d.x; // n - for "neighbour"
    let nY = y + d.y;
    if (nX < 0 || nX >= size.x || nY < 0 || nY >= size.y) {
      continue;
    }

    let nTools = getTools(risk[nY][nX]);
    let allowedTools = _.intersection(tools, nTools); // tools we can switch to
    for (let nTool of allowedTools) {
      let nId = `${nX} ${nY} ${nTool}`;
      if (processedIds.has(nId)) {
        continue;
      }

      let nNode = nodes.get(nId);
      if (!nNode) {
        nNode = {x: nX, y: nY, tool: nTool, id: nId, dist: Number.MAX_SAFE_INTEGER};
        nodes.set(nId, nNode);
        q.push(nNode);
      }

      let nDist = dist + (nTool === tool ? 1 : 8);
      if (nDist <= nNode.dist) {
        nNode.dist = nDist;
      }
    }
  }

  processedIds.add(id);
  if (id === tgtId) {
    break;
  }
}

let tgtNode = nodes.get(tgtId);
if (!tgtNode) {
  throw new Error('Target node not reached!');
}

let part2 = tgtNode.dist;
console.log(`Part 2: ${part2}`);
console.assert(part2 === 969);
