/**
 *
 * @param {number} size
 * @returns final puzzle with 0 in the end
 */
export function generateZeroLastGoal(size) {
  let arr = [];
  let row = [];
  for (let x = 0; x < size; x++) {
    row = [];
    for (let i = 0; i < size; i++) row.push(1 + i + x * size);
    arr.push(row);
  }
  arr[size - 1][size - 1] = 0;
  return arr;
}

export default generateZeroLastGoal;
