import Big from 'big.js';

const toCamel = (s) => {
  return s.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace("-", "").replace("_", "");
  });
};

const isArray = (a) => Array.isArray(a);

const isObject = (o) =>
  o === Object(o) && !isArray(o) && typeof o !== "function";

const keysToCamel = (o) => {
  if (isObject(o)) {
    const n = {};

    Object.keys(o).forEach((k) => {
      n[toCamel(k)] = keysToCamel(o[k]);
    });

    return n;
  } else if (isArray(o)) {
    return o.map((i) => {
      return keysToCamel(i);
    });
  }

  return o;
};

const parseRate = (s) => Big(s).div(Big(10).pow(27));
const parseRatio = (r) => Big(r).div(10000);
const parseTimestamp = (s) => parseFloat(s) / 1e6;

const bigMin = (a, b) => (a.lt(b) ? a : b);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export {
  bigMin,
  keysToCamel,
  parseRate,
  parseRatio,
  parseTimestamp,
  sleep
};
