export const sum = (numbers: number[]) => {
  return numbers.reduce((sum, num) => sum + num, 0);
};

export const multiply = (numbers: number[]) => {
  return numbers.reduce((res, num) => res * num, 1);
};

export const unique = (arr: any[]) => {
  return [...new Set(arr)];
};

export const isBetween = (x: number, [min, max]: [number, number]) => {
  return x >= min && x <= max;
};
