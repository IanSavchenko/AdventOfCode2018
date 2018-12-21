let _ = require('lodash');
let fs = require('fs');
let util = require('../util');

// INPUT PROCESSING
let parseCmd = function(cmd){
  return {
    op: cmd[0],
    a: +cmd[1],
    b: +cmd[2],
    c: +cmd[3]
  };
};

let data = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();
data = util.splitLines(data);

let ipReg = +data[0].split(' ')[1];
let prog = _.chain(data).drop(1).map(line => {
  return parseCmd(line.split(' '));
}).value(); 

// COMMON
let reg = util.arr1dInit(6, 0);
let ip = 0;

let exec = {
  addr(cmd){
    reg[cmd.c] = reg[cmd.a] + reg[cmd.b];
  },
  addi(cmd){
    reg[cmd.c] = reg[cmd.a] + cmd.b;
  },

  mulr (cmd) {
    reg[cmd.c] = reg[cmd.a] * reg[cmd.b];
  },
  muli (cmd) {    
    reg[cmd.c] = reg[cmd.a] * cmd.b;
  },

  banr (cmd) {
    reg[cmd.c] = reg[cmd.a] & reg[cmd.b];
  },
  bani (cmd) {
    reg[cmd.c] = reg[cmd.a] & cmd.b;
  }, 

  borr (cmd) {
    reg[cmd.c] = reg[cmd.a] | reg[cmd.b];
  },
  bori (cmd) {
    reg[cmd.c] = reg[cmd.a] | cmd.b;
  },

  setr (cmd) {
    reg[cmd.c] = reg[cmd.a];
  }, 
  seti (cmd) {
    reg[cmd.c] = cmd.a;
  },

  gtir (cmd) {
    reg[cmd.c] = cmd.a > reg[cmd.b] ? 1 : 0;
  },
  gtri (cmd){
    reg[cmd.c] = reg[cmd.a] > cmd.b ? 1 : 0;
  },
  gtrr (cmd) {
    reg[cmd.c] = reg[cmd.a] > reg[cmd.b] ? 1 : 0;
  },

  eqir (cmd) {
    reg[cmd.c] = cmd.a === reg[cmd.b] ? 1 : 0;
  }, 
  eqri (cmd) {
    reg[cmd.c] = reg[cmd.a] === cmd.b ? 1 : 0;
  },
  eqrr (cmd) {
    reg[cmd.c] = reg[cmd.a] === reg[cmd.b] ? 1 : 0;
  }
};

// PART 1
let part1;
let part2;

let controlInstr = _.find(prog, cmd => {
  return (cmd.a === 0 || cmd.b === 0) && 
        cmd.op.includes('eq');
});

let controlReg = controlInstr.a === 0 ? controlInstr.b : controlInstr.a;
let values = [];

while (true) {
  if (ip >= prog.length || (part1 && part2)) {
    break;
  }

  reg[ipReg] = ip;
  let cmd = prog[ip];
  if (cmd === controlInstr) {
    let val = reg[controlReg];
    if (!part1) {
      part1 = val;
    }

    if (!part2 && _.includes(values, val)) {
      part2 = _.last(values); // loop detected
    }

    values.push(val);
  }

  exec[cmd.op](cmd);

  ip = reg[ipReg];
  ip += 1;
}

console.log(`Part 1: ${part1}`);
console.assert(part1 === 10846352);

console.log(`Part 2: ${part2}`);
console.assert(part2 === 5244670);