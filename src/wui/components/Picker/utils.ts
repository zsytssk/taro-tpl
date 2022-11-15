import { Item } from '.';

export function getValueFromIndex<T>(indexArr: number[], data: Item<T>[][]) {
  const result: T[] = [];

  for (let i = 0; i < indexArr.length; i++) {
    const indexItem = indexArr[i];
    const dataItem = data[i];
    const resultItem = dataItem[indexItem].value;
    result.push(resultItem);
  }

  return result;
}
export function getIndexFromValue<T>(value: T[], data: Item<T>[][]) {
  const result: number[] = [];

  for (let i = 0; i < value.length; i++) {
    const valueItem = value[i];
    const dataItem = data[i];
    const resultItem = dataItem.findIndex((item) => item.value === valueItem);
    result.push(resultItem);
  }

  return result;
}
