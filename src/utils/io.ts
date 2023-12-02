export type Day =
  | 'day-01'
  | 'day-02'
  | 'day-03'
  | 'day-04'
  | 'day-05'
  | 'day-06'
  | 'day-07'
  | 'day-08'
  | 'day-09'
  | 'day-10'
  | 'day-11'
  | 'day-12'
  | 'day-13'
  | 'day-14'
  | 'day-15'
  | 'day-16'
  | 'day-17'
  | 'day-18'
  | 'day-19'
  | 'day-20'
  | 'day-21'
  | 'day-22'
  | 'day-23'
  | 'day-24'
  | 'day-25';

type Transform<Res, Input = string> = (s: Input) => Res;

export const readFile = async (filepath: string) => {
  const file = Bun.file(filepath);
  const text = await file.text();
  return text.trim();
};

export const readInput = async (dir: Day, fileName: string = 'input') => {
  const filepath = `./src/${dir}/${fileName}.txt`;
  return readFile(filepath);
};

export const parseLines = <T = string>(
  input: string,
  as?: Transform<T>,
  { includeEmpty }: { includeEmpty?: boolean } = {}
) => {
  let lines = input.split('\n');
  if (!includeEmpty) {
    lines = lines.filter(Boolean);
  }
  return as ? lines.map(as) : (lines as T[]);
};

export const parseGroups = <T = string>(input: string, as?: Transform<T>) => {
  const groups = input.split('\n\n');

  return groups.map((group) => {
    return parseLines(group, as);
  }) as T[][];
};
