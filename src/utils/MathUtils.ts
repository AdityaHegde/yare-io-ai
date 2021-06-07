export function findInArray<T>(
  array: Array<T>,
  valueGetter: (a: T) => number = (a: T) => a as any,
  checkFunc: (a: number, b: number, idx: number) => number = (a, b) => a - b,
): [element: T, idx: number] {
  if (array.length === 0) {
    return [null, -1];
  }
  if (array.length <= 1) {
    return [array[0], 0];
  }

  let found = valueGetter(array[0]);
  let foundIdx = 0;

  for (let i = 1; i < array.length; i++) {
    const value = valueGetter(array[i]);

    if (checkFunc(found, value, i) > 0) {
      found = value;
      foundIdx = i;
    }
  }

  return [array[foundIdx], foundIdx];
}
