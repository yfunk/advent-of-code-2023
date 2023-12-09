import { readInput } from 'io';
import { parseLines, splitString } from 'parse';
import { sum } from 'utils/math';

const input = await readInput('day-09');

export const part1 = () => {
  const sequences = parseSequences(input);
  const extrapolations: number[] = [];

  for (const sequence of sequences) {
    extrapolations.push(extrapolate(sequence, 'next'));
  }

  return sum(extrapolations);
};

export const part2 = () => {
  const sequences = parseLines(input, (line) => splitString(line, (v) => +v));
  const extrapolations: number[] = [];

  for (const sequence of sequences) {
    extrapolations.push(extrapolate(sequence, 'previous'));
  }

  return sum(extrapolations);
};

//#region common
/**
 * Recursively extrapolates the next / previous value in a sequence of numbers.
 */
const extrapolate = (sequence: number[], direction: 'next' | 'previous'): number => {
  if (sequence.every((v) => v === 0)) return 0;

  const differences: number[] = [];
  for (let i = 1; i < sequence.length; i++) {
    differences.push(sequence[i] - sequence[i - 1]);
  }

  const extrapolated = extrapolate(differences, direction);

  if (direction === 'next') {
    return sequence.at(-1)! + extrapolated;
  } else {
    return sequence[0] - extrapolated;
  }
};

const parseSequences = (input: string) => {
  return parseLines(input, (line) => splitString(line, (v) => +v));
};
//#endregion
