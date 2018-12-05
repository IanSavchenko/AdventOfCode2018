let _ = require('lodash');
let fs = require('fs');
let path = require('path');
let axios = require('axios').default;

const YEAR = 2018;

process.addListener('unhandledRejection', function(err) {
  console.error(`Unhandled rejection: ${err.message}\n${err.stack}`);
  process.exit(1);
});

process.addListener('uncaughtException', function(err) {
  console.error(`Uncaught exception: ${err.message}\n${err.stack}`);
  process.exit(1);
});

let resolveArgs = function() { 
  let day = process.argv[2];

  if (!day) {
    let now = new Date();
    if (now.getFullYear() !== 2018 || now.getMonth() !== 11 || now.getDate() > 25) {
      throw new Error('Day number not specified and cannot be inferred');
    }
  
    day = now.getDate();
  }

  return {day};
};

let resolvePaths = function({day}) {
  let dayDir = path.join(__dirname, `${_.padStart(day, 2, '0')}`);
  let inputFilePath = path.join(dayDir, 'input.txt');
  let taskPath = path.join(dayDir, 'task.js');

  return {
    dayDir,
    inputFilePath,
    taskPath
  };
};

let checkDir = function({dayDir, taskPath}) {
  if (!fs.existsSync(dayDir)) {
    fs.mkdirSync(dayDir);
  }

  if (!fs.existsSync(taskPath)) {
    fs.copyFileSync(path.join(`${__dirname}`, 'tpl', 'task.js'), taskPath);
  }
};

let downloadInput = async function({inputFilePath, day}) {
  if (fs.existsSync(inputFilePath) && fs.statSync(inputFilePath).size > 0) {
    return;
  }

  console.log('Donwloading input file...');
  let {aocCookie} = require('./env');
  let input = await axios.get(`https://adventofcode.com/${YEAR}/day/${day}/input`, {
    headers: {
      cookie: aocCookie
    }
  });

  fs.writeFileSync(inputFilePath, input.data, 'utf8');
};

let runTask = function({taskPath}) {
  console.time('Run time');
  require(taskPath); 
  console.timeEnd('Run time');
};

let main = async function() {
  let {day} = resolveArgs();
  
  console.log(`Running for day ${day}...`);

  let {
    inputFilePath,
    taskPath,
    dayDir
  } = resolvePaths({day});
  
  checkDir({taskPath, dayDir});
  await downloadInput({inputFilePath, day});
  runTask({taskPath});
};

main();