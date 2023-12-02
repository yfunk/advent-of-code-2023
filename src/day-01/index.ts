import { parseLines, readInput } from 'io';

const input = await readInput('day-01');

//#region helpers
const findDigits = (str: string) => {
  const values = str.split('');

  const first = values.find((value) => +value)!;
  const last = values.findLast((value) => +value)!;

  return [first, last];
};
//#endregion

export const part1 = () => {
  const lines = parseLines(input);

  let sum = 0;

  for (const line of lines) {
    const [first, last] = findDigits(line);

    sum += Number(first + last);
  }

  return sum;
};

export const part2 = () => {
  const lines = parseLines(input);

  // words can overlap (e.g. "oneight"), so we need to retain its first and last character
  const wordToNumber = {
    one: 'o1e',
    two: 't2to',
    three: 't3e',
    four: 'f4r',
    five: 'f5e',
    six: 's6x',
    seven: 's7n',
    eight: 'e8t',
    nine: 'n9e',
  };

  let sum = 0;

  for (const line of lines) {
    let replaced = line;
    for (const [word, replacement] of Object.entries(wordToNumber)) {
      replaced = replaced.replaceAll(word, replacement);
    }

    const [first, last] = findDigits(replaced);

    sum += Number(first + last);
  }

  return sum;
};
