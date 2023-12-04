import { isNumber, isString } from './type';

export const asc = <T extends number | string>(a: T, b: T): number => {
  if (isNumber(a) && isNumber(b)) {
    return a - b;
  } else if (isString(a) && isString(b)) {
    return a.localeCompare(b);
  }
  throw new Error('Invalid argument types');
};

export const desc = <T extends number | string>(a: T, b: T): number => {
  if (isNumber(a) && isNumber(b)) {
    return b - a;
  } else if (isString(a) && isString(b)) {
    return b.localeCompare(a);
  }
  throw new Error('Invalid argument types');
};
