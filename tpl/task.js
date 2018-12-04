let _ = require('lodash');
let fs = require('fs');
let util = require('../util');

// INPUT PROCESSING
let data = fs.readFileSync(__dirname + '/input.txt', 'utf8');
let _input = util.splitLines(data).map(val => Number(val));

// PART 1
let part1 = 0;


console.log(`Part 1: ${part1}`);

// PART 2
let part2 = 0;


console.log(`Part 2: ${part2}`);