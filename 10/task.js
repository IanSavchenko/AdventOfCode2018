let _ = require('lodash');
let fs = require('fs');
let util = require('../util');

// INPUT PROCESSING
let data = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();
let inp = util.splitLines(data).map(val => {
  val = /position=<([\s-\d]+), ([\s-\d]+)> velocity=<([\s-\d]+), ([\s-\d]+)>/.exec(val);
  return {
    x: +val[1],
    y: +val[2],
    dx: +val[3],
    dy: +val[4]
  };
});

// PART 1 + 2
let print = function(points) {
  let x = _.minBy(points, 'x').x;
  let y = _.minBy(points, 'y').y;
  let cols = _.maxBy(points, 'x').x - x + 1;
  let rows = _.maxBy(points, 'y').y - y + 1;
  let arr = util.arr2dInit(rows, cols, false);
  _.forEach(points, p => {
    arr[p.y - y][p.x - x] = true;
  });

  _.forEach(arr, function(line) {
    console.log(_.map(line, ch => ch ? '#' : '.').join(''));
  });
};

let part2 = 0;
let minDist = Number.MAX_SAFE_INTEGER;
let minDistPts;

while (true) {
  part2++;

  _.forEach(inp, p => {
    p.x += p.dx;
    p.y += p.dy;
  });

  let center =  {
    x: _.mean(_.map(inp, 'x')),
    y: _.mean(_.map(inp, 'y'))
  };

  let distance = _.map(inp, p => {
    return Math.abs(p.x - center.x) + Math.abs(p.y - center.y);
  });

  distance = _.sum(distance);
  if (distance < minDist) {
    minDist = distance;
    // don't need to store every step  
    if (distance < 10000) {
      minDistPts = _.cloneDeep(inp);
    }
  } else {
    // on the previous step we had clear picture
    part2 = part2 - 1;

    console.log('Part 1:');
    print(minDistPts);
    break;
  }
}

console.log(`Part 2: ${part2}`);
console.assert(part2 === 10942);