// disassembled input
let part1;
let part2;

let values = new Set();
let prev;

let r0 = 0;
let r2 = 0;
let r4 = 0;
let r5 = 0;

while (true) {
  r2 = r5 | 65536; // 6: bori 5 65536 2
  r5 = 7571367;
  while (true) {
    r4 = r2 & 255; // 8: bani 2 255 4
    r5 += r4; // addr 5 4 5
    r5 = r5 & 16777215; // bani 5 16777215 5 
    r5 = r5 * 65899; // 11: muli 5 65899 5
    r5 = r5 & 16777215; // 12: bani 5 16777215 5
    if (256 > r2) { // gtir 256 2 4
      break;
    } 

    r4 = 0; // seti 0 2 4
    while (true) {
      if ((r4 + 1) * 256 > r2) { 
        r2 = r4;
        break;
      } 
      r4++;
    }
  }
  
  if (!part1) {
    part1 = r5;
    console.log(`Part 1: ${part1}`);
    console.assert(part1 === 10846352);
  }

  if (!part2 && values.has(r5)) {
    part2 = prev; // first before loop starts
    console.log(`Part 2: ${part2}`);
    console.assert(part2 === 5244670);
    break;
  }

  values.add(r5);
  prev = r5;

  // this will never happen
  if (r5 === r0) {
    break;
  }
}

