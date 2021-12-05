export function rand(items) {
  // "~~" for a closest "int"
  return items[~~(items.length * Math.random())];
}
