let _ = require('lodash');
let fs = require('fs');
let util = require('../util');

// INPUT PROCESSING
let data = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();

// PART 1
let part1 = 0;

let runPart1 = function(inp) {
  inp = +data;
  let rec = [3, 7];

  let first = 0;
  let second = 1;
  while (true) {
    let comb = rec[first] + rec[second];
    rec.push(...util.getNumberDigits(comb));

    first = (first + rec[first] + 1) % rec.length;
    second = (second + rec[second] + 1) % rec.length;
  
    if (rec.length >= inp + 10) {
      break;
    }
  }
  
  part1 = _.takeRight(rec, 10).join('');
};

runPart1(data);

console.log(`Part 1: ${part1}`);
console.assert(part1 === '2157138126');

// PART 2
let part2 = 0;

let runPart2 = function(inp) {
  inp = inp.toString();
  let rec = [3, 7];
  let first = 0;
  let second = 1;
  while (true) {
    let comb = rec[first] + rec[second];
    rec.push(...util.getNumberDigits(comb));

    first = (first + rec[first] + 1) % rec.length;
    second = (second + rec[second] + 1) % rec.length;
    
    let last = _.takeRight(rec, inp.length + 1).join('');
    let end = last.substr(1);
    if (end === inp) {
      part2 = rec.length - inp.length;
      break;
    }

    end = last.substr(0, inp.length);
    if (end === inp) {
      part2 = rec.length - inp.length - 1;
      break;
    }
  }

};

runPart2(data);

console.log(`Part 2: ${part2}`);
console.assert(part2 === 20365081);