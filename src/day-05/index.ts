import { readInput } from 'io';
import { parseGroups, splitString } from 'parse';
import { chunk } from 'utils/array';
import { isBetween, min, range, unique } from 'utils/math';

type Map = { name: string; mappings: Mapping[] };
type Mapping = { srcOffset: number; destOffset: number; length: number };

const input = await readInput('day-05');

export const part1 = () => {
  const almanac = parseAlmanac(input);

  const locations = findLocations(almanac.seeds, almanac.maps);
  const closest = min(locations);

  return closest;
};

// TODO: Brute-force approach only works on example, takes forever on actual input
export const part2 = () => {
  const almanac = parseAlmanac(input);

  const pairs = chunk(almanac.seeds, 2);
  const seeds: number[] = [];

  for (const [start, length] of pairs) {
    seeds.push(...range(length, start));
  }

  const locations = findLocations(seeds, almanac.maps);
  const closest = min(locations);

  return closest;
};

//#region helpers
const parseAlmanac = (input: string) => {
  const [[_seeds], ..._maps] = parseGroups(input);

  const seeds = splitString(_seeds.split(':')[1], (v) => +v);
  const maps: Map[] = [];

  for (const _map of _maps) {
    const [_name, ..._mappings] = _map;
    const name = _name.split(' ')[0];

    const mappings: Mapping[] = [];

    for (const _mapping of _mappings) {
      const [destOffset, srcOffset, length] = splitString(_mapping, (v) => +v);
      mappings.push({ srcOffset, destOffset, length });
    }

    maps.push({ name, mappings });
  }

  return { seeds, maps };
};

const findLocations = (seeds: number[], maps: Map[]) => {
  const locations: number[] = [];
  let count = 1;

  for (const seed of seeds) {
    console.log(`seed: ${count++}/${seeds.length}`);
    let intermediate = seed;

    for (const map of maps) {
      let mapping = intermediate;

      for (const { srcOffset, destOffset, length } of map.mappings) {
        if (isBetween(intermediate, [srcOffset, srcOffset + length - 1])) {
          mapping = intermediate - srcOffset + destOffset;
          break;
        }
      }

      intermediate = mapping;
    }

    // found location after maps are processed
    locations.push(intermediate);
  }

  return locations;
};

//#endregion
