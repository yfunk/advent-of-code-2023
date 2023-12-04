import { readInput } from 'io';
import { parseLines, parseString } from 'parse';
import { sum } from 'utils/math';
import { intersection } from 'utils/set';

type Card = { id: number; winning: Set<number>; numbers: Set<number> };

const input = await readInput('day-04');

export const part1 = () => {
  const cards = parseLines(input, parseCard);

  let total = 0;

  for (const { winning, numbers } of cards) {
    const matches = intersection(winning, numbers).size;

    if (matches > 0) {
      const points = Math.pow(2, matches - 1);
      total += points;
    }
  }

  return total;
};

export const part2 = () => {
  const originalCards = parseLines(input, parseCard);

  const count: number[] = new Array(originalCards.length + 1).fill(0);

  const queue = [...originalCards];
  const cache: number[] = []; // matches for each card id never change

  for (const card of queue) {
    count[card.id] += 1;

    const matches =
      cache[card.id] ?? (cache[card.id] = intersection(card.winning, card.numbers).size);

    for (let i = 0; i < matches; i++) {
      const copy = originalCards[card.id + i];
      if (!copy) continue;

      queue.push(copy);
    }
  }

  const total = sum(count);

  return total;
};

//#region helpers
const parseCard = (line: string) => {
  const [_id, _data] = line.split(':');

  const id = Number(parseString(_id).at(-1));
  const [winning, numbers] = _data
    .split('|')
    .map((str) => new Set(parseString(str, (v) => Number(v))));

  return { id, winning, numbers } as Card;
};
//#endregion
