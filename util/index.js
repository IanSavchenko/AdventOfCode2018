let _ = require('lodash');
let CircularList = require('./circular-list');

let removeChar = function(str, pos, count = 1) {
  return str.substr(0, pos) + str.substr(pos + count);
};

let splitLines = function(str) {
  return str.split('\n');
};

let arr1dInit = function(len, val = 0) {
  return Array(len).fill(val);
};

let arr1dForEach = function(array, 
  callback, 
  start = 0, 
  len = array.length) {

  let stop;
  for (let i = start; i < len; i++) {
    stop = callback(array[i], i, array);
    if (stop == false) {
      break;
    }
  }
};

let arr2dInit = function(rows, cols, val = 0) {
  return Array(rows).fill().map(() => Array(cols).fill(val));
};

// On critical paths usual 'for' loops used, since they are much faster
let arr2dForEach = (
  array, 
  callback, 
  iStart = 0, 
  jStart = 0, 
  rows = array.length, 
  cols = array[0].length) => {

  let stop;
  for(let i = iStart; i < rows; i++) {
    if (stop == false) {
      break;
    }

    for (let j = jStart; j < cols; j++) {
      stop = callback(array[i][j], i, j, array);
      if (stop == false) {
        break;
      }
    }
  }
};

let maxAndIndex = function(arr, func = _.identity) {
  let maxCalc = Number.MIN_SAFE_INTEGER;
  let maxIdx;
  let maxVal;

  _.forEach(arr, function(val, idx) {
    let calc = func(val);
    if (calc > maxCalc) {
      maxCalc = calc;
      maxVal = val;
      maxIdx = idx;
    }
  });

  return {
    value: maxVal,
    index: maxIdx,
    calc: maxCalc
  };
};


let minAndIndex = function(arr, func = _.identity) {
  let minCalc = Number.MAX_SAFE_INTEGER;
  let minIdx;
  let minVal;

  _.forEach(arr, function(val, idx) {
    let calc = func(val);
    if (calc < minCalc) {
      minCalc = calc;
      minVal = val;
      minIdx = idx;
    }
  });

  return {
    value: minVal,
    index: minIdx,
    calc: minCalc
  };
};

module.exports = {
  removeChar,
  splitLines,
  arr2dInit,
  arr2dForEach,
  arr1dInit,
  arr1dForEach,
  maxAndIndex,
  minAndIndex,
  CircularList
};

// consider adding
let _arr2dRotateRight = function(arr) {
  let output = arr2dInit(arr[0].length, arr.length);
  arr2dForEach(arr, function(val, i, j) {
    output[j][arr.length - i - 1] = val;
  });

  return output;
};

let _arr2dRotateLeft = function(arr) {
  let output = arr2dInit(arr[0].length, arr.length);
  arr2dForEach(arr, function(val, i, j) {
    output[arr[0].length - j - 1][i] = val;
  });

  return output;
};

let _arr2dFlipV = function(arr) {
  let output = arr2dInit(arr.length, arr[0].length);
  arr2dForEach(arr, function(val, i, j) {
    output[i][j] = arr[i][arr[0].length - j - 1];
  });

  return output;
};

let _arr2dFlipH = function(arr) {
  let output = arr2dInit(arr.length, arr[0].length);
  arr2dForEach(arr, function(val, i, j) {
    output[i][j] = arr[arr.length - i - 1][j];
  });

  return output;    
};
