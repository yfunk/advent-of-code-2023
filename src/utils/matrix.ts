export type Matrix<T> = T[][];
export type Coordinates = [x: number, y: number];

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

export const matrixAt = <T>(matrix: Matrix<T>, coords: Coordinates) => {
  const [x, y] = coords;
  return matrix[y][x];
};

export const isInBounds = (matrix: Matrix<unknown>, coords: Coordinates) => {
  const [x, y] = coords;
  return matrix[y] !== undefined && matrix[y][x] !== undefined;
};

export const forEachElement = <T>(
  matrix: Matrix<T>,
  fn: (value: T, coords: Coordinates) => void
) => {
  matrix.forEach((row, i) => {
    row.forEach((value, j) => {
      fn(value, [j, i]);
    });
  });
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
