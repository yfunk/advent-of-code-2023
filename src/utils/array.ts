export const chunk = <T>(array: T[], size: number) => {
  return array.reduce(function (result, value, index, array) {
    if (index % size === 0) result.push(array.slice(index, index + size));
    return result;
  }, [] as T[][]);
};
