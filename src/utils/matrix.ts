export type Matrix<T> = T[][];
export type Coordinates = [x: number, y: number];

export const matrixAt = <T>(matrix: Matrix<T>, coords: Coordinates) => {
  const [x, y] = coords;
  return matrix[y][x];
};

export const isInBounds = (matrix: Matrix<unknown>, coords: Coordinates) => {
  const [x, y] = coords;
  return matrix[y] !== undefined && matrix[y][x] !== undefined;
};

//#region surrounding
export const getSurrounding = (coords: Coordinates, options?: { diagonal?: boolean }) => {
  const [x, y] = coords;

  return [
    [x, y - 1], // top
    [x - 1, y], // left
    [x + 1, y], // right
    [x, y + 1], // bottom

    ...(options?.diagonal
      ? [
          [x - 1, y - 1], // top left
          [x + 1, y - 1], // top right
          [x - 1, y + 1], // bottom left
          [x + 1, y + 1], // bottom right
        ]
      : []),
  ] as Coordinates[];
};

export const forEachSurrounding = <T>(
  matrix: Matrix<T>,
  coords: Coordinates,
  fn: (value: T, coords: Coordinates) => void,
  options?: { diagonal?: boolean }
) => {
  const surrounding = getSurrounding(coords, options);

  surrounding.forEach((coords) => {
    const [x, y] = coords;
    if (matrix[y] && matrix[y][x]) {
      fn(matrix[y][x], coords);
    }
  });
};

export const everySurrounding = <T>(
  matrix: Matrix<T>,
  coords: Coordinates,
  test: (value: T, coords: Coordinates) => boolean,
  options?: { diagonal?: boolean }
) => {
  const surrounding = getSurrounding(coords, options);

  return surrounding.every((coords) => {
    const [x, y] = coords;
    if (!isInBounds(matrix, coords)) return true;

    return test(matrix[y][x], coords);
  });
};

export const someSurrounding = <T>(
  matrix: Matrix<T>,
  coords: Coordinates,
  test: (value: T, coords: Coordinates) => boolean,
  options?: { diagonal?: boolean }
) => {
  const surrounding = getSurrounding(coords, options);

  return surrounding.some((coords) => {
    const [x, y] = coords;
    if (!isInBounds(matrix, coords)) return false;

    return test(matrix[y][x], coords);
  });
};
//#endregion

//#region row / column
const getRow = <T>(matrix: Matrix<T>, row: number) => {
  return matrix[row];
};

const getColumn = <T>(matrix: Matrix<T>, col: number) => {
  return matrix.map((row) => row[col]);
};

export const forEachElement = <T>(
  matrix: Matrix<T>,
  fn: (value: T, coords: Coordinates) => void,
  options?: { row?: number } | { column?: number }
) => {
  if (options && 'row' in options && options.row !== undefined) {
    const row = getRow(matrix, options.row);

    row.forEach((row, i) => {
      fn(row, [i, options.row!]);
    });
  } else if (options && 'column' in options && options.column !== undefined) {
    const column = getColumn(matrix, options.column);

    column.forEach((col, i) => {
      fn(col, [options.column!, i]);
    });
  } else {
    matrix.forEach((row, i) => {
      row.forEach((value, j) => {
        fn(value, [j, i]);
      });
    });
  }
};

export const everyElement = <T>(
  matrix: Matrix<T>,
  test: (value: T, coords: Coordinates) => boolean,
  options?: { row?: number } | { column?: number }
) => {
  if (options && 'row' in options && options.row !== undefined) {
    const row = getRow(matrix, options.row);

    return row.every((row, i) => {
      return test(row, [i, options.row!]);
    });
  } else if (options && 'column' in options && options.column !== undefined) {
    const column = getColumn(matrix, options.column);

    return column.every((col, i) => {
      return test(col, [options.column!, i]);
    });
  } else {
    return matrix.every((row, i) => {
      return row.every((value, j) => {
        return test(value, [j, i]);
      });
    });
  }
};

export const someElement = <T>(
  matrix: Matrix<T>,
  test: (value: T, coords: Coordinates) => boolean,
  options?: { row?: number } | { column?: number }
) => {
  if (options && 'row' in options && options.row !== undefined) {
    const row = getRow(matrix, options.row);

    return row.some((row, i) => {
      return test(row, [i, options.row!]);
    });
  } else if (options && 'column' in options && options.column !== undefined) {
    const column = getColumn(matrix, options.column);

    return column.some((col, i) => {
      return test(col, [options.column!, i]);
    });
  } else {
    return matrix.some((row, i) => {
      return row.some((value, j) => {
        return test(value, [j, i]);
      });
    });
  }
};
//#endregion
