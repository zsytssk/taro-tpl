export function compareVersion(v1: string, v2: string) {
  const v1_arr = v1.split('.');
  const v2_arr = v2.split('.');
  const len = Math.max(v1.length, v2.length);

  while (v1_arr.length < len) {
    v1_arr.push('0');
  }
  while (v2_arr.length < len) {
    v2_arr.push('0');
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i]);
    const num2 = parseInt(v2[i]);

    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }

  return 0;
}
