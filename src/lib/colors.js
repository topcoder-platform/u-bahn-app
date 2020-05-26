export const avatarColors = [
  "#FFB762",
  "#FD827A",
  "#F2C94C",
  "#56CCF2",
  "#BB6BD9",
  "#FD827A",
  "#60EC77",
  "#2D9CDB",
  "#9B51E0",
  "#8CD6FF",
];

export function makeColorIterator(items, step = 1) {
  let nextIndex = 0;
  let iterationCount = 0;

  const colorIterator = {
    next: function () {
      let result;
      if (true) {
        result = { value: items[nextIndex % items.length], done: false };
        nextIndex += step;
        iterationCount++;
        return result;
      }
      return { value: iterationCount, done: true };
    },
  };
  return colorIterator;
}
