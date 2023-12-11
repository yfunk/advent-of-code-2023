import { readInput } from 'io';
import { parseLines, splitString } from 'parse';
import { sum } from 'utils/math';
import { Coordinates, Matrix, everyElement, forEachElement } from 'utils/matrix';

type Expanding = { rows: number[]; columns: number[] };

const input = await readInput('day-11');

export const part1 = () => {
  const image = parseLines(input, (line) => line.split(''));

  const distances = findGalaxyDistances(image, 2);
  return sum(distances);
};

export const part2 = () => {
  const image = parseLines(input, (line) => line.split(''));

  const distances = findGalaxyDistances(image, 1000000);
  return sum(distances);
};

//#region common
/**
 * Finds the distance between each pair of galaxies in the image.
 *
 * Pair `[a, b]` is being considered the same as pair `[b, a]` and only counted once.
 */
const findGalaxyDistances = (image: Matrix<string>, expansionFactor: number) => {
  const expanding = findExpanding(image);

  // find galaxies and calculate their coordinates with expansion
  const galaxies = new Map<number, Coordinates>();

  forEachElement(image, (value, coords) => {
    if (value === '#') {
      const expandedCoords = transformCoordinates(coords, expanding, expansionFactor);
      galaxies.set(galaxies.size + 1, expandedCoords);
    }
  });

  // calculate distance between each pair of galaxies
  const pairs = new Set<string>();
  const distances: number[] = [];

  for (const [id, coords] of galaxies.entries()) {
    for (const [id2, coords2] of galaxies.entries()) {
      if (id === id2 || pairs.has(`${id},${id2}`) || pairs.has(`${id2},${id}`)) continue;

      const [x1, y1] = coords;
      const [x2, y2] = coords2;

      // the shortest path is always the manhattan distance of the two points
      const distance = Math.abs(x1 - x2) + Math.abs(y1 - y2);
      distances.push(distance);

      pairs.add(`${id},${id2}`);
    }
  }

  return distances;
};

/**
 * Finds rows and columns without galaxies, which will expand
 */
const findExpanding = (matrix: Matrix<string>) => {
  // find rows without galaxies
  const rows: number[] = [];
  for (let row = 0; row < matrix.length; row++) {
    if (everyElement(matrix, (c) => c === '.', { row })) {
      rows.push(row);
    }
  }

  // find columns without galaxies
  const columns: number[] = [];
  for (let col = 0; col < matrix[0].length; col++) {
    if (everyElement(matrix, (c) => c === '.', { column: col })) {
      columns.push(col);
    }
  }

  return { rows, columns } as Expanding;
};

/**
 * Transforms coordinates to expanded galaxy coordinates
 */
const transformCoordinates = (
  coordinates: Coordinates,
  expanding: Expanding,
  expansionFactor: number
) => {
  const [x, y] = coordinates;

  const expandedX = x + expanding.columns.filter((col) => col < x).length * (expansionFactor - 1);
  const expandedY = y + expanding.rows.filter((row) => row < y).length * (expansionFactor - 1);

  return [expandedX, expandedY] as Coordinates;
};

//#endregion
