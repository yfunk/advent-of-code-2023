export const sum = (numbers: number[]) => {
  return numbers.reduce((sum, num) => sum + num, 0);
};

export const multiply = (numbers: number[]) => {
  return numbers.reduce((res, num) => res * num, 1);
};

export const unique = <T>(arr: T[]) => {
  return [...new Set(arr)];
};

export const isBetween = (x: number, [min, max]: [number, number]) => {
  return x >= min && x <= max;
};

export const min = (numbers: number[]) => {
  return Math.min(...numbers);
};

export const max = (numbers: number[]) => {
  return Math.max(...numbers);
};

export const range = (length: number, start?: number) => {
  const values = [...Array(length).keys()];
  return start ? values.map((v) => start + v) : values;
};
