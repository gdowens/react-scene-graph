export default function shallowDiff(objA, objB) {
  const result = [];
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  // Test for A's keys different from B.
  const hasOwn = Object.prototype.hasOwnProperty;
  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) ||
        objA[keysA[i]] !== objB[keysA[i]]) {
      result.push(keysA[i]);
    }
  }

  // Test for B's keys different from A.
  for (let i = 0; i < keysB.length; i++) {
    if (!hasOwn.call(objA, keysB[i]) ||
        objB[keysB[i]] !== objA[keysB[i]]) {
      if (result.indexOf(keysB[i]) === -1) {
        result.push(keysB[i]);
      }
    }
  }

  return result;
}
