import { expect, test } from 'vitest'
import { Scheduler } from '../compiler/common/interpreter/Scheduler'

test('create a 1-dimensional array of length 3 filled with different default values', () => {
  let defaultValues = [null,0,1];
  defaultValues.forEach(dv => expect(Scheduler.newArray(dv,3)).toStrictEqual([dv,dv,dv]));
})

test('creates a 2-dimensional array of dimensions 3x2 filled with zeroes', () => {
  expect(Scheduler.newArray(0,3,2)).toStrictEqual([[0,0],[0,0],[0,0]]);
})

test('create a 3-dimensional array of dimensions 3x2x4 filled with nulls', () => {
  let expectedResult = [ [[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null]]];
  expect(Scheduler.newArray(null,3,2,4)).toStrictEqual(expectedResult);
})

test('entries are independent, i.e. do not point to the same element', () => {
  let array = Scheduler.newArray(0,3,4,5);
  array[0][2][3] = 1;

  expect(array[1][2][3]).toStrictEqual(0);
})

