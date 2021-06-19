// https://github.com/UselessPickles/ts-enum-util/blob/5b394ad1715f39e1d36505d9f364794877986cbe/src/index.ts#L908

const isNonIndexKey = (key: string): boolean =>
  // If after converting the key to an integer, then back to a string, the result is different
  // than the original key, then the key is NOT an integer index.
  // See ECMAScript spec section 15.4: http://www.ecma-international.org/ecma-262/5.1/#sec-15.4
  key !== String(parseInt(key, 10))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getValuesOf = (type: any): any => Object
  .keys(type)
  .filter(isNonIndexKey)
  .map((key: string) => type[key])

export enum UserRole {
  admin = 'admin',
  user = 'user',
}

export const userRoleValues = getValuesOf(UserRole)
