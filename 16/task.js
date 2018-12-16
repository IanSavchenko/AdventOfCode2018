let _ = require('lodash');
let fs = require('fs');
let util = require('../util');

// INPUT PROCESSING
let parseCmd = function(cmd){
  return {
    op: cmd[0],
    a: cmd[1],
    b: cmd[2],
    c: cmd[3]
  };
};

let data = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();
data = util.splitLines(data);

let tests = [];
_.chain(data).chunk(4).forEach((lines) => {
  if (!lines[0]) {
    return false;
  }

  tests.push({
    before: lines[0].substr(9, 10).split(',').map(v => +v),
    cmd: parseCmd(lines[1].split(' ').map(v => +v)),
    after: lines[2].substr(9, 10).split(',').map(v => +v),
  });
}).value();

let prog = _.chain(data).drop(tests.length * 4 + 2).map(line => {
  return parseCmd(line.split(' ').map(v => +v));
}).value(); 

// COMMON
let reg = [];

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
  } ,
  eqrr (cmd) {
    reg[cmd.c] = reg[cmd.a] === reg[cmd.b] ? 1 : 0;
  }
};

// PART 1
let part1 = 0;
for (let test of tests) {
  let cnt = 0;
  for(let cmdName in exec) {
    let cmdExec = exec[cmdName];
    reg = test.before.slice();
    cmdExec(test.cmd);
    if (_.isEqual(reg, test.after)) {
      cnt++;
    }
  }

  if (cnt >= 3) {
    part1++;
  }
}

console.log(`Part 1: ${part1}`);
console.assert(part1 === 612);

// PART 2
let part2 = 0;

let ops = [];
while (true) {
  let cmdNames = _.keys(exec);
  cmdNames = _.without(cmdNames, ...ops);

  for (let test of tests) {
    let cnt = 0;
    let onlyName = '';
    for(let cmdName of cmdNames) {
      let cmdExec = exec[cmdName];
      reg = test.before.slice();
      cmdExec(test.cmd);
      if (_.isEqual(reg, test.after)) {
        cnt++;
        onlyName = cmdName;
      }
    }
  
    if (cnt === 1) {
      ops[test.cmd.op] = onlyName;
    } 
  }

  if (ops.length === 16 && _.every(ops, x => x)) {
    break;
  }
}

reg = util.arr1dInit(4, 0);
for (const cmd of prog) {
  let opName = ops[cmd.op];
  exec[opName](cmd);
}

part2 = reg[0];

console.log(`Part 2: ${part2}`);
console.assert(part2 === 485);