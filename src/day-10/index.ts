import { readInput } from 'io';
import { parseMatrix } from 'parse';
import { Coordinates, Matrix, matrixAt } from 'utils/matrix';

type Pipe = '|' | '-' | 'L' | 'J' | '7' | 'F' | 'S';
type Direction = 'N' | 'E' | 'S' | 'W';

const input = await readInput('day-10');

export const part1 = () => {
  const grid = parseMatrix(input) as Matrix<string>;
  const start = findStart(grid)!;

  const length = loopLength(grid, start);
  const farthest = length / 2;

  return farthest;
};

export const part2 = () => {
  // TODO
};

//#region helpers
const findStart = (grid: Matrix<string>) => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 'S') {
        return [x, y] as Coordinates;
      }
    }
  }
};

const loopLength = (grid: Matrix<string>, coords: Coordinates, length: number = 0): number => {
  const [x, y] = coords;
  const next = nextCoordinates(grid, coords);

  // if there is no unvisited connecting pipe, we found the end ot the loop
  if (!next) return length + 1;

  grid[y][x] = 'X'; // prevent revisiting
  return loopLength(grid, next, length + 1);
};

// possible directions to connect to from the current pipe
const POSSIBLE_DIRECTIONS: Record<Pipe, Direction[]> = {
  '|': ['N', 'S'],
  '-': ['E', 'W'],
  'L': ['N', 'E'],
  'J': ['N', 'W'],
  '7': ['S', 'W'],
  'F': ['S', 'E'],
  'S': ['N', 'E', 'S', 'W'],
};

// pipes that can connect to the current one from the given direction
const CONNECTING_PIPES: Record<Direction, Pipe[]> = {
  N: ['|', '7', 'F'],
  E: ['-', 'J', '7'],
  S: ['|', 'L', 'J'],
  W: ['-', 'L', 'F'],
};

const nextCoordinates = (grid: Matrix<string>, coords: Coordinates) => {
  const [x, y] = coords;
  const pipe = grid[y][x] as Pipe;

  const directions = POSSIBLE_DIRECTIONS[pipe];

  const coordinates: Record<Direction, Coordinates> = {
    N: [x, y - 1],
    E: [x + 1, y],
    S: [x, y + 1],
    W: [x - 1, y],
  };

  for (const direction of directions) {
    const dirCoords = coordinates[direction];
    const dirPipe = matrixAt(grid, dirCoords) as Pipe;

    if (CONNECTING_PIPES[direction].includes(dirPipe)) {
      // visited pipes are overridden with 'X', so there is at most one connecting unvisited pipe
      return dirCoords;
    }
  }

  return null;
};
//#endregion
