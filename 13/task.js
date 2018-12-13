let _ = require('lodash');
let fs = require('fs');
let util = require('../util');

// INPUT PROCESSING
let data = fs.readFileSync(__dirname + '/input.txt', 'utf8');
let inp = util.splitLines(data).filter(x => x).map(val => val.split(''));

let cars = [];
util.arr2dForEach(inp, function(val, y, x) {
  let dx = 0, dy = 0;
  switch(val) {
  case('>'):
    dx = 1;
    inp[y][x] = '-';
    break;
  case('<'):
    dx = - 1;
    inp[y][x] = '-';
    break;
  case('^'):
    dy = -1;
    inp[y][x] = '|';
    break;
  case('v'):
    dy = 1;
    inp[y][x] = '|';
    break;
  default: 
    return;
  }

  cars.push({
    x,
    y,
    dx,
    dy,
    t:0,
  });
});

// PART 1 + 2

let part1 = 0;
let part2 = 0;

let crashed = new Set();

while(true) {
  cars = _.sortBy(cars, car => car.x + ' ' + car.y);
  
  _.forEach(cars, car => {
    if (crashed.has(car)) {
      return;
    }

    let temp;
    let col = _.find(cars, {
      x: car.x + car.dx,
      y: car.y + car.dy
    });

    if (col) {
      if (!part1) {
        part1 = `${col.x},${col.y}`;
      }

      crashed.add(col);
      crashed.add(car);
      return;
    }

    car.x = car.x + car.dx;
    car.y = car.y + car.dy;

    switch(inp[car.y][car.x]) {
    case('-'):
    case('|'):
      break;
    case('\\'):
      temp = car.dy;
      car.dy = car.dx;
      car.dx = temp; 
      break;
    case('/'):
      temp = car.dy;
      car.dy = -car.dx;
      car.dx = -temp; 
      break;
    case('+'):
      if (car.t % 3 === 0) {
        temp = car.dy;
        car.dy = -car.dx;
        car.dx = temp;
      } else if (car.t % 3 === 2) {
        temp = car.dx;
        car.dx = -car.dy;
        car.dy = temp;
      }

      car.t++;
      break;
    default:
      throw new Error('wrong');
    }
  });

  _.remove(cars, x => crashed.has(x));

  if (cars.length === 1) {
    part2 = `${cars[0].x},${cars[0].y}`;
  }

  if (part1 && part2) {
    break;
  }
}

// PART 1

console.log(`Part 1: ${part1}`);
console.assert(part1 === '63,103');

// PART 2

console.log(`Part 2: ${part2}`);
console.assert(part2 === '16,134');