let r0 = 0;
let r1 = 0;
let r2 = 0;
let r3 = 0;
let r5 = 10551345;

r1 = 1;
while (true) {
  r2 = 1;
  while (true) {
    r3 = r1 * r2;
    if (r3 === r5) {
      r0 = r0 + r1;
    }
  
    r2++;
    if (r2 > r5) {
      break;
    }

    // optimization
    if (r2 * r1 > r5) {
      break;
    }
  }

  r1++;
  if (r1 > r5) {
    break;
  }
}

let part2 = r0;
console.log(`Part 2: ${part2}`);
console.assert(part2 === 19354944);

