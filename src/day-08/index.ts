import { readInput } from 'io';
import { parseGroups, removeWhiteSpace } from 'parse';
import { lcm } from 'utils/math';

type Network = {
  instructions: string[];
  nodes: Map<string, Node>;
};

type Node = {
  left: string;
  right: string;
};

const input = await readInput('day-08');

export const part1 = () => {
  const network = parseNetwork(input);

  const steps = stepsToEnd(network, 'AAA');
  return steps;
};

export const part2 = () => {
  const map = parseNetwork(input);

  // find all start nodes
  const startNodes = Array.from(map.nodes.keys()).filter((node) =>
    isStartNode(node, { part2: true })
  );

  // calculate the steps to reach an end node from each start node
  const requiredSteps = startNodes.map((startNode) => stepsToEnd(map, startNode, { part2: true }));

  // find the least common multiple of all required steps (this is the total number of steps
  // after which we are only on nodes that end with 'Z')
  const steps = lcm(requiredSteps);

  return steps;
};

//#region common
const parseNetwork = (input: string) => {
  const [_instructions, _nodes] = parseGroups(input);

  const instructions = _instructions[0].split('');
  const nodes = new Map<string, Node>();

  for (let _node of _nodes) {
    _node = removeWhiteSpace(_node);

    const [id, _children] = _node.split('=');
    const [_, left, right] = _children.split(/[^A-z]/);

    nodes.set(id, { left, right });
  }

  return { instructions, nodes } as Network;
};

const stepsToEnd = (map: Network, startNode: string, options?: { part2?: boolean }) => {
  const { instructions, nodes } = map;

  let currentNode = startNode;
  let steps = 0;

  while (!isEndNode(currentNode, options)) {
    const { left, right } = nodes.get(currentNode)!;
    const instruction = instructions[steps % instructions.length];

    currentNode = instruction === 'L' ? left : right;
    steps++;
  }

  return steps;
};
//#endregion

//#region helpers
const isStartNode = (node: string, options?: { part2?: boolean }) => {
  return options?.part2 ? node.endsWith('A') : node === 'AAA';
};

const isEndNode = (node: string, options?: { part2?: boolean }) => {
  return options?.part2 ? node.endsWith('Z') : node === 'ZZZ';
};
//#endregion
