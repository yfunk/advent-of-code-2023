import { readInput } from 'io';
import { parseLines, removeWhiteSpace, splitString } from 'parse';
import { multiply } from 'utils/math';

type Race = { time: number; record: number };

const input = await readInput('day-06');

export const part1 = () => {
  const races = parseAsMultipleRaces(input);

  const ways: number[] = [];

  for (const race of races) {
    ways.push(simulateRace(race));
  }

  return multiply(ways);
};

export const part2 = () => {
  const race = parseAsSingleRace(input);

  const ways = simulateRace(race);

  return ways;
};

//#region helpers
/**
 * Parse the input interpreting the data as multiple races (Part 1).
 */
const parseAsMultipleRaces = (input: string) => {
  const [times, records] = parseLines(input, (line) => {
    const [, _numbers] = line.split(':');
    return splitString(_numbers, (v) => +v);
  });

  return times.map((time, i) => ({ time, record: records[i] }) as Race);
};

/**
 * Parse the input interpreting the data as a single race with bad kerning (Part 2).
 */
const parseAsSingleRace = (input: string) => {
  const [time, record] = parseLines(input, (line) => {
    const [, _numbers] = line.split(':');
    return removeWhiteSpace(_numbers, (v) => +v);
  });

  return { time, record } as Race;
};

/**
 * Simulate all possible strategies for the race to determine how many ways there are to beat the record.
 */
const simulateRace = (race: Race) => {
  let ways = 0;

  for (let i = 0; i <= race.time; i++) {
    const distance = (race.time - i) * i;
    if (distance > race.record) ways++;
  }

  return ways;
};
//#endregion
