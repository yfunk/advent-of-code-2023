import { parseMatrix, readInput } from 'io';
import { multiply } from 'utils';
import {
  Coordinates,
  Matrix,
  forEachElement,
  forEachSurrounding,
  someSurrounding,
} from 'utils/matrix';

const input = await readInput('day-03');

export const part1 = () => {
  const matrix = parseMatrix(input);

  let sum = 0;

  for (let y = 0; y < matrix.length; y++) {
    let numberBuffer = '';
    let isPartNumber = false;

    for (let x = 0; x < matrix[y].length; x++) {
      const char = matrix[y][x];

      if (isDigit(char)) {
        numberBuffer += char;
        isPartNumber = isPartNumber || someSurrounding(matrix, [x, y], (char) => isSymbol(char));
      }

      if (!isDigit(char) || x === matrix[y].length - 1) {
        if (numberBuffer && isPartNumber) {
          sum += Number(numberBuffer);
        }
        numberBuffer = '';
        isPartNumber = false;
      }
    }
  }

  return sum;
};

export const part2 = () => {
  const matrix = parseMatrix(input);

  let sum = 0;

  forEachElement(matrix, (char, coords) => {
    if (char === '*') {
      const partNumbers = collectPartNumbers(matrix, coords);

      if (partNumbers.length === 2) {
        sum += multiply(partNumbers);
      }
    }
  });

  return sum;
};

//#region helpers
const isDigit = (char: string) => /[0-9]/.test(char);
const isSymbol = (char: string) => char !== '.' && !isDigit(char);

const collectPartNumbers = (matrix: Matrix<string>, coords: Coordinates) => {
  const partNumbers: number[] = [];

  forEachSurrounding(matrix, coords, (char, coords) => {
    const [x, y] = coords;

    let number = '';
    let pos = x;

    if (!isDigit(char)) return;

    // find beginning of part number
    while (isDigit(matrix[y][pos - 1])) {
      pos--;
    }

    // read part number
    while (isDigit(matrix[y][pos])) {
      number += matrix[y][pos];

      matrix[y][pos] = 'X'; // prevent reading this number again
      pos++;
    }

    partNumbers.push(Number(number));
  });

  return partNumbers;
};
//#endregion
