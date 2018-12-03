let removeChar = function(str, pos, count = 1) {
  return str.slice(0, pos) + str.slice(pos + count);
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

module.exports = {
  removeChar,
  splitLines,
  arr2dInit,
  arr2dForEach,
  arr1dInit,
  arr1dForEach
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
