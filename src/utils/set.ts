export const union = <T>(a: Set<T>, b: Set<T>) => {
  return new Set([...a, ...b]);
};

export const intersection = <T>(a: Set<T>, b: Set<T>) => {
  return new Set([...a].filter((value) => b.has(value)));
};

export const difference = <T>(a: Set<T>, b: Set<T>) => {
  return new Set([...a].filter((value) => !b.has(value)));
};
