let _ = require('lodash');
let fs = require('fs');
let util = require('../util');

// INPUT PROCESSING
let data = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();

let groups = [];
let immuneArmy;

for (let lines of data.split('\n\n')) {
  lines = util.splitLines(lines);
  let army = lines[0];
  if (_.startsWith(lines[0], 'Immune')) {
    immuneArmy = army;
  }

  lines = _.drop(lines, 1);
  groups.push(..._.map(lines, line => {
    let lss = line.split(' ');
    let lsa = line.split('with an attack that does ')[1].split(' ');
    let group = {
      army,
      units: +lss[0],
      hp: +lss[4],
      attack: +lsa[0],
      attackType: lsa[1],
      initiative: +lsa[5],
      weak: [],
      immune: []
    };
  
    if (line.includes('(')) {
      let inBraces = line.split('(')[1].split(')')[0];
      let parts = inBraces.split('; ');
      for (let part of parts) {
        let type = part.split(' ')[0]; // weak or immune
        group[type] = part.split('to ')[1].split(',').map(t => t.trim());
      }
    }
  
    return group;
  }));
}

let calcDamage = function(attacking, defending) {
  if (defending.immune.includes(attacking.attackType)) {
    return 0;
  }

  let ep = attacking.units * attacking.attack;
  if (defending.weak.includes(attacking.attackType)) {
    return ep * 2;
  }

  return ep;
};

let combat = function(groups) {
  while (true) {
    let damageDone = false;
    groups = _.sortBy(groups, t => t.units * t.attack, 'initiative').reverse();

    let attacked = new Set();
    let pairs = [];
    for (let attacking of groups) {
      let otherGroups = _.filter(groups, g => g.army !== attacking.army && !attacked.has(g));
      if (otherGroups.length === 0) {
        continue;
      }

      otherGroups = otherGroups.map(group => {
        return {
          damage: calcDamage(attacking, group),
          group
        };
      });

      if (_.every(otherGroups, g => g.damage === 0)) {
        continue;
      }

      let defending = _.sortBy(otherGroups,
        'damage', 
        g => g.group.units * g.group.attack, 
        'group.initiative')
        .reverse()[0].group;

      pairs.push({
        defending,
        attacking
      });

      attacked.add(defending);
    }

    pairs = _.sortBy(pairs, 'attacking.initiative').reverse();

    let dead = new Set();
    for (let pair of pairs) {
      let {defending, attacking} = pair;
      if (dead.has(attacking)) {
        continue;
      }

      let damage = calcDamage(attacking, defending);
      let killed = Math.floor(damage/defending.hp);
      defending.units -= killed;

      if (defending.units <= 0) {
        dead.add(defending);
      }

      if (killed > 0) {
        damageDone = true;
      }
    }

    if (!damageDone) {
      return undefined;
    }

    _.pullAll(groups, [...dead]);

    let armies = _.groupBy(groups, 'army');
    if (_.keys(armies).length === 1) {
      break;
    }
  }

  return {
    units: _.sumBy(groups, 'units'),
    army: groups[0].army
  };
};

// PART 1
let part1 = combat(_.cloneDeep(groups)).units;

console.log(`Part 1: ${part1}`); 
console.assert(part1 === 23385);

// PART 2
let part2;
let boost = 0;
while (true) {
  boost++;

  let input = _.cloneDeep(groups);
  _.filter(input, {army: immuneArmy}).forEach(g => g.attack += boost);

  let outcome = combat(input);
  if (!outcome) {
    continue;
  }

  if (outcome.army !== immuneArmy) {
    continue;
  }

  part2 = outcome.units;
  break;
}

console.log(`Part 2: ${part2}`);
console.assert(part2 === 2344);