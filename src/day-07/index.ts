import { readInput } from 'io';
import { parseLines } from 'parse';
import { unique } from 'utils/math';

type Hand = { type: HandType; cards: number[]; bid: number };

const enum HandType {
  FiveOfAKind = 7,
  FourOfAKind = 6,
  FullHouse = 5,
  ThreeOfAKind = 4,
  TwoPairs = 3,
  OnePair = 2,
  HighCard = 1,
}

const input = await readInput('day-07');

export const part1 = () => {
  const CARD_ORDER = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
  const hands = parseLines(input, (line) => parseHand(line, CARD_ORDER));

  const ranked = hands.sort(compareHands);
  const total = ranked.reduce((acc, hand, index) => acc + hand.bid * (index + 1), 0);

  return total;
};

export const part2 = () => {
  const CARD_ORDER = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A'];
  const hands = parseLines(input, (line) => parseHand(line, CARD_ORDER, { withJoker: true }));

  const ranked = hands.sort(compareHands);
  const total = ranked.reduce((acc, hand, index) => acc + hand.bid * (index + 1), 0);

  return total;
};

//#region helpers
const parseHand = (
  line: string,
  cardOrder: (string | number)[],
  options?: { withJoker?: boolean }
) => {
  const [_cards, _bid] = line.split(' ');

  const cards = _cards.split('').map((c) => cardOrder.indexOf(c) + 1);
  const bid = +_bid;

  const type = handType(cards, options?.withJoker);

  return { type, cards, bid } as Hand;
};

const JOKER_CARD = 1;

const handType = (cards: number[], withJoker?: boolean) => {
  const jokers = withJoker ? cards.filter((card) => card === JOKER_CARD).length : 0;

  // create sorted list of duplicate cards groups in the hand (e.g [1, 1, 2, 3, 3] -> [2, 2, 1])
  const groups = unique(cards)
    // filter out joker cards if they are being used as wildcards (part 2)
    .filter((card) => !(withJoker && card === JOKER_CARD))
    .map((uniqueCard) => cards.filter((card) => card === uniqueCard).length)
    .sort()
    .reverse();

  // edge case: 5 joker cards (part 2)
  if (withJoker && !groups[0]) return HandType.FiveOfAKind;

  // adding jokers to the biggest group of cards will always give the best result
  groups[0] += jokers;

  if (groups[0] === 5) {
    return HandType.FiveOfAKind;
  }
  if (groups[0] === 4) {
    return HandType.FourOfAKind;
  }
  if (groups[0] === 3 && groups[1] === 2) {
    return HandType.FullHouse;
  }
  if (groups[0] === 3) {
    return HandType.ThreeOfAKind;
  }
  if (groups[0] === 2 && groups[1] === 2) {
    return HandType.TwoPairs;
  }
  if (groups[0] === 2) {
    return HandType.OnePair;
  } else {
    return HandType.HighCard;
  }
};

const compareHands = (a: Hand, b: Hand) => {
  if (a.type > b.type) return 1;
  if (a.type < b.type) return -1;

  // if hands are the same type, compare cards
  for (let i = 0; i < a.cards.length; i++) {
    if (a.cards[i] > b.cards[i]) return 1;
    if (a.cards[i] < b.cards[i]) return -1;
  }

  return 0;
};
//#endregion
