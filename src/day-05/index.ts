import { readInput } from 'io';
import { parseGroups, splitString } from 'parse';
import { chunk } from 'utils/array';
import { isBetween, max, min, range, unique } from 'utils/math';
import { asc } from 'utils/sort';

type Map = { name: string; mappings: Mapping[] };
type Mapping = { srcStart: number; destStart: number; length: number };

type Range = { start: number; end: number };

const input = await readInput('day-05');

export const part1 = () => {
  const almanac = parseAlmanac(input);

  const locations: number[] = [];

  for (const seed of almanac.seeds) {
    let intermediate = seed;

    for (const map of almanac.maps) {
      let mapping = intermediate;

      for (const { srcStart, destStart, length } of map.mappings) {
        if (isBetween(intermediate, [srcStart, srcStart + length - 1])) {
          mapping = intermediate - srcStart + destStart;
          break;
        }
      }

      intermediate = mapping;
    }

    locations.push(intermediate);
  }

  const closest = min(locations);

  return closest;
};

export const part2 = () => {
  const almanac = parseAlmanac(input);

  // ranges of seeds [start, end), last number excluded
  let ranges = chunk(almanac.seeds, 2).map(
    ([start, length]) => ({ start, end: start + length }) as Range
  );

  // the closest location has to be at the start of one of the ranges
  // map all seed ranges to location ranges and find the minimum
  for (const map of almanac.maps) {
    const mappedRanges: Range[] = [];

    for (const range of ranges) {
      let mapped = range;

      for (const { srcStart, destStart, length } of map.mappings) {
        const overlapStart = max([range.start, srcStart]);
        const overlapEnd = min([range.end, srcStart + length]);

        if (overlapStart < overlapEnd) {
          mapped = {
            start: overlapStart - srcStart + destStart,
            end: overlapEnd - srcStart + destStart,
          };

          // check for remaining parts of range and add them back to `ranges` for mapping
          if (overlapStart > range.start) ranges.push({ start: range.start, end: overlapStart });
          if (range.end > overlapEnd) ranges.push({ start: overlapEnd, end: range.end });
          break;
        }
      }

      mappedRanges.push(mapped);
    }

    ranges = mappedRanges;
  }

  const closest = min(ranges.map(({ start }) => start));

  return closest;
};

//#region helpers
const parseAlmanac = (input: string) => {
  const [[_seeds], ..._maps] = parseGroups(input);

  const seeds = splitString(_seeds.split(':')[1], (v) => Number(v));
  const maps: Map[] = [];

  for (const _map of _maps) {
    const [_name, ..._mappings] = _map;
    const name = _name.split(' ')[0];

    const mappings: Mapping[] = [];

    for (const _mapping of _mappings) {
      const [destStart, srcStart, length] = splitString(_mapping, (v) => Number(v));
      mappings.push({ srcStart, destStart, length });
    }

    maps.push({ name, mappings });
  }

  return { seeds, maps };
};
//#endregion
