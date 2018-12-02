let _ = require('lodash');
let fs = require('fs');

let data = fs.readFileSync(__dirname + '/input.txt', 'utf8');
let input = data.split('\n').map(val => Number(val));

let part1 = _.sum(input);
console.log(`Part 1: ${part1}`);

let seen = {};
let sum = 0;
let i = 0;
while (!(sum in seen)) {
  seen[sum] = true;
  sum += input[i++ % input.length];
}

console.log(`Part 2: ${sum}`);