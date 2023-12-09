import { readInput } from 'io';
import { parseLines, splitString } from 'parse';
import { sum } from 'utils/math';

const input = await readInput('day-09', 'input');

export const part1 = () => {
  const sequences = parseSequences(input);
  const extrapolations: number[] = [];

  for (const sequence of sequences) {
    extrapolations.push(extrapolateValue(sequence, 'next'));
  }

  return sum(extrapolations);
};

export const part2 = () => {
  const sequences = parseLines(input, (line) => splitString(line, (v) => +v));
  const extrapolations: number[] = [];

  for (const sequence of sequences) {
    extrapolations.push(extrapolateValue(sequence, 'previous'));
  }

  return sum(extrapolations);
};

//#region common
/**
 * Extrapolates the next or previous number in the sequence
 */
const extrapolateValue = (sequence: number[], direction: 'next' | 'previous') => {
  // recursively break down sequence into new sequences of the difference between each step
  const breakdown = breakdownSequence(sequence);

  let extrapolated = 0;

  // use breakdown to extrapolate the next or previous value from the bottom up
  for (let i = breakdown.length - 2; i >= 0; i--) {
    if (direction === 'next') {
      const last = breakdown[i].at(-1)!;
      extrapolated = last + extrapolated;
    } else {
      const first = breakdown[i][0];
      extrapolated = first - extrapolated;
    }
  }

  return extrapolated;
};

const breakdownSequence = (sequence: number[]) => {
  const breakdown = [sequence];

  while (!breakdown.at(-1)!.every((v) => v === 0)) {
    const current = breakdown.at(-1)!;
    const next: number[] = [];

    for (let i = 1; i < current.length; i++) {
      next.push(current[i] - current[i - 1]);
    }

    breakdown.push(next);
  }

  return breakdown;
};
//#endregion

//#region helpers
const parseSequences = (input: string) => {
  return parseLines(input, (line) => splitString(line, (v) => +v));
};
//#endregion
