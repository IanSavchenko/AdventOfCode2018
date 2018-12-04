let _ = require('lodash');
let fs = require('fs');
let util = require('../util');

// INPUT PROCESSING
let data = fs.readFileSync(__dirname + '/input.txt', 'utf8');
let input = util.splitLines(data);

let periods = [];
let curId;
let cur;

input
  .filter(x => x)
  .sort()
  .map(x => /\[(\d+)-(\d+)-(\d+) (\d+):(\d+)\] (.*)/.exec(x))
  .map(x => {
    return {
      m: x[5],
      action: x[6]
    };
  })
  .map(x => {
    if (_.startsWith(x.action, 'Guard')) {
      curId = /(\d+)/.exec(x.action)[1];
    }

    if (_.startsWith(x.action, 'falls')) {
      cur = {
        s: +x.m,
        id: curId
      };
    }

    if (_.startsWith(x.action, 'wakes')) {
      cur.e = +x.m;
      cur.t = cur.e - cur.s;
      periods.push(cur);
    }
  });

// PART 1
let byGuards = _.groupBy(periods, 'id');
let {
  index: maxGuard
} = util.maxAndIndex(byGuards, x => _.chain(x).map('t').sum().value());

let minutes = _.range(0, 60)
  .map(x => _.filter(
    byGuards[maxGuard], 
    t => x >= t.s && x < t.e
  ).length);

let {
  index: maxMinute
} = util.maxAndIndex(minutes);

let part1 = maxMinute * maxGuard;

console.log(`Part 1: ${part1}`);

// PART 2
let part2 = 0;

let globalMaxVal = 0;
let globalMaxMin;
let globalMaxG;

_.forEach(byGuards, function(times, guard) {
  
  let minutes = _.range(0, 60)
    .map(x => _.filter(
      times, 
      t => x >= t.s && x < t.e
    ).length);

  let {
    index: minute,
    value: minuteVal
  } = util.maxAndIndex(minutes);

  if (minuteVal > globalMaxVal) {
    globalMaxVal = minuteVal;
    globalMaxMin = minute;
    globalMaxG = +guard;
  }
});

part2 = globalMaxG*globalMaxMin;

console.log(`Part 2: ${part2}`);