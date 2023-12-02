import { parseLines, readInput } from 'io';

const input = await readInput('day-02');

//#region helpers
const parseData = (line: string) => {
  const [gameString, recordString] = line.split(':');

  const id = Number(gameString.split(' ')[1]);
  const record = recordString.split(';').map((pull) =>
    pull.split(',').reduce((acc, cube) => {
      const [count, color] = cube.trim().split(' ');
      return { ...acc, [color]: +count };
    }, {})
  );

  return { id, record };
};
//#endregion

export const part1 = () => {
  const lines = parseLines(input);

  let sum = 0;

  for (const line of lines) {
    const { id, record } = parseData(line);

    const query = { red: 12, green: 13, blue: 14 };

    // no pull can have more the the number of cubes specified in the query
    const isPossible = record.every((pull) => {
      const colors = Object.entries(pull) as Array<[keyof typeof query, number]>;
      return colors.every(([color, count]) => count <= query[color]);
    });

    if (isPossible) sum += id;
  }

  return sum;
};

export const part2 = () => {
  const lines = parseLines(input);

  let sum = 0;

  for (const line of lines) {
    const { record } = parseData(line);

    // fewest number of cubes necessary to make the game possible
    const minimum = { red: 0, green: 0, blue: 0 };

    for (const pull of record) {
      const colors = Object.entries(pull) as Array<[keyof typeof minimum, number]>;

      for (const [color, count] of colors) {
        minimum[color] = Math.max(minimum[color], count);
      }
    }

    sum += minimum.red * minimum.green * minimum.blue;
  }

  return sum;
};
