let _ = require('lodash');
let fs = require('fs');
let util = require('../util');

// INPUT PROCESSING
let data = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();
let lines = util.splitLines(data);

let inp = [...lines[0].substr(15)].map(c => c === '#');
let rules = _.chain(lines).drop(2).map(line => {
  let pattern = line.substr(0, 5).split('').map(c => c === '#');
  let result = line[9] === '#';
  return {
    pattern,
    result
  };
}).value();

let pots = _.map(inp, (s, n) => {
  return {
    s,
    n
  };
});

let start = 0;
let end = pots.length - 1;

let it = [];
let diffs = [];

// PART 1
let part1 = 0;
for(let i = 0; i < 1000; i++) {
  let newStart = _.findIndex(pots, {
    s: true
  });

  while (start + 5 > newStart) {
    pots.splice(0, 0, {
      s: false,
      n: --start
    });
    end++;
  }

  let newEnd = _.findLastIndex(pots, {
    s: true
  });

  while (newEnd + 5 > end) {
    pots.push({
      s: false,
      n: ++end + start
    });
  }

  let newStates = [];
  for(let j = 2; j < pots.length - 2; j++) {
    let sub = _.chain(pots).drop(j - 2).take(5).value();
    sub = sub.map(state => state.s);

    let rule = _.find(rules, r => {
      return _.isEqual(r.pattern, sub);
    });

    if (rule) {
      newStates.push(rule.result);
    } else {
      newStates.push(false);
    }
  }

  let k = 0;
  for(let j = 2; j < pots.length - 2; j++) {
    pots[j].s = newStates[k++];
  }

  it.push(_.chain(pots).filter(p => p.s).map('n').sum().value());
  diffs.push(it[i] - it[i - 1]);
  if (_.every(_.takeRight(diffs, 100), d => d === diffs[i])) {
    break;
  }
}

part1 = it[19];
console.log(`Part 1: ${part1}`);
console.assert(part1 === 1696);

// PART 2
let part2 = _.last(diffs) * (50*1000*1000*1000 - it.length) + _.last(it);

console.log(`Part 2: ${part2}`);
console.assert(part2 === 1799999999458);