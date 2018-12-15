let _ = require('lodash');
let fs = require('fs');
let util = require('../util');

// INPUT PROCESSING
let data = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();
let inpMap = util.splitLines(data).filter(x => x).map(x => [...x]);

let inpUnits = [];
util.arr2dForEach(inpMap, function(val, x, y) {
  if (val === 'G') {
    inpUnits.push({
      x,
      y,
      type: val,
      hp: 200
    });
  } else if (val === 'E') {
    inpUnits.push({
      x,
      y,
      type: val,
      hp: 200
    });
  }
});

let dirs = [{x: -1, y: 0}, {x: 0, y: -1}, {x: 0, y: 1}, {x: 1, y: 0}];

let bfs = function(arr, startX, startY) {
  let q = [{x: startX, y: startY, dist: 0}];
  while (q.length) {
    let {x,y,dist} = q.shift();
    if (dist != 0 && arr[x][y] != '.') {
      continue;
    }

    arr[x][y] = dist;

    dist++;
    for (let dir of dirs) {
      q.push({x: x + dir.x, y: y + dir.y, dist});
    }
  }

  return arr;
};

let backtrack = function(arr, x, y) {
  let val = arr[x][y];
  if (val === 0 || val === 1) {
    return {x, y};
  }

  for (let dir of dirs) {
    if (arr[x + dir.x][y + dir.y] === val - 1) {
      return backtrack(arr, x + dir.x, y + dir.y);
    }
  }

  throw new Error('not reached while backtracking');
};

let getPaths = function(unit, inp, enemies) {
  let paths = [];

  // looking for enemies next to the unit
  let {x, y} = unit;
  for (let dir of dirs) {
    let enemy = _.find(enemies, {x: x + dir.x, y: y + dir.y});
    if (enemy) {
      paths.push({dist: 0, target: enemy, move: {x, y}});
    }
  }

  // have some paths next to the unit - no need for BFS
  if (paths.length) {
    return paths;
  }

  let arr = _.cloneDeep(inp);
  let reachArr = bfs(arr, unit.x, unit.y);
  _.forEach(enemies, enemy => {
    let {x, y} = enemy;
    for (let dir of dirs) {
      let dist = reachArr[x + dir.x][y + dir.y];
      if (_.isNumber(dist)) {
        // we have path to a cell next to target
        paths.push({dist, target: enemy, move: backtrack(reachArr, x + dir.x, y + dir.y)});
      }
    }
  });

  return paths;
};

// PART 1
let part1 = 0;

let calc = function(power) {
  let units = _.cloneDeep(inpUnits);
  let inp = _.cloneDeep(inpMap);

  let rounds = 0;
  while(true) {
    units = _.sortBy(units, 'x', 'y');
    _.forEach(units.slice(), unit => {
      if (!_.includes(units, unit)) {
        // dead
        return;
      }

      let enemyType = unit.type === 'G' ? 'E' : 'G';
      let enemies = _.filter(units, {type: enemyType});
      if (!enemies.length) {
        // no enemies left - round incomplete
        rounds--;
        return false;
      }
  
      let paths = getPaths(unit, inp, enemies);
      if (paths.length === 0) {
        // nowhere to go, stop
        return;
      }
  
      paths = _.sortBy(paths, 'dist', 'target.x', 'target.y', 'move.x', 'move.y');
      let bestPath = paths[0];  
      if (bestPath.dist !== 0) {
        // move
        inp[unit.x][unit.y] = '.';
        unit.x = bestPath.move.x;
        unit.y = bestPath.move.y;
        inp[unit.x][unit.y] = unit.type;
        paths = getPaths(unit, inp, enemies);
      }
  
      let toAttack = _.filter(paths, {dist: 0});
      if (toAttack.length) {
        toAttack = _.map(toAttack, 'target');  
        toAttack = _.sortBy(toAttack, 'hp', 'x', 'y');
        let attackTarget = toAttack[0];
        attackTarget.hp -= unit.type === 'G' ? 3 : power;
      
        if (attackTarget.hp <= 0) {
          inp[attackTarget.x][attackTarget.y] = '.';
          _.pull(units, attackTarget);
        }
      }
    });
  
    rounds++;  
    if (_.uniqBy(units, x => x.type).length === 1) {
      break;
    }
  }  

  return {
    rounds,
    units
  };
};

let outcome = calc(3);

part1 = outcome.rounds * _.sumBy(outcome.units, 'hp');

console.log(`Part 1: ${part1}`);
console.assert(part1 === 197025);

// PART 2
let part2 = 0;
let elves = _.filter(inpUnits, {type: 'E'}).length;

for (let power = 4; power < 100; power++) {
  let outcome = calc(power);
  if (_.filter(outcome.units, {type: 'E'}).length === elves) {
    part2 = outcome.rounds * _.sumBy(outcome.units, 'hp');
    break;
  }
}

console.log(`Part 2: ${part2}`);
console.assert(part2 === 44423);