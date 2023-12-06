type Transform<Res, Input = string> = (s: Input) => Res;

export const parseLines = <T = string>(
  input: string,
  transform?: Transform<T>,
  { includeEmpty }: { includeEmpty?: boolean } = {}
) => {
  let lines = input.split('\n');
  if (!includeEmpty) {
    lines = lines.filter(Boolean);
  }
  return transform ? lines.map(transform) : (lines as T[]);
};

export const parseGroups = <T = string>(input: string, transform?: Transform<T>) => {
  const groups = input.split('\n\n');

  return groups.map((group) => {
    return parseLines(group, transform);
  }) as T[][];
};

export const parseMatrix = <T = string>(input: string, transform?: Transform<T>) => {
  const lines = parseLines(input);

  return lines.map((line) => {
    const values = line.split('');
    return transform ? values.map(transform) : (values as T[]);
  });
};

export const splitString = <T = string>(input: string, transform?: Transform<T>) => {
  const values = input.trim().split(/\s+/);
  return transform ? values.map(transform) : (values as T[]);
};

export const removeWhiteSpace = <T = string>(input: string, transform?: Transform<T>) => {
  const value = input.trim().replace(/\s+/g, '');
  return transform ? transform(value) : (value as T);
};
