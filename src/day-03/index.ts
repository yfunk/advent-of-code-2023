import { readInput } from 'io';
import { parseMatrix } from 'parse';
import { sum, multiply } from 'utils/math';
import { Coordinates, Matrix, forEachElement, forEachSurrounding } from 'utils/matrix';

const input = await readInput('day-03');

export const part1 = () => {
  const matrix = parseMatrix(input);

  let result = 0;

  forEachElement(matrix, (char, coords) => {
    if (isSymbol(char)) {
      const partNumbers = collectPartNumbers(matrix, coords);

      result += sum(partNumbers);

      if (partNumbers.length === 2) {
      }
    }
  });

  return result;
};

export const part2 = () => {
  const matrix = parseMatrix(input);

  let result = 0;

  forEachElement(matrix, (char, coords) => {
    if (char === '*') {
      const partNumbers = collectPartNumbers(matrix, coords);

      if (partNumbers.length === 2) {
        result += multiply(partNumbers);
      }
    }
  });

  return result;
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
