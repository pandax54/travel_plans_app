import { Pojo } from 'objection'
import * as R from 'ramda'

export const lowerCaseObjectProperty = (obj: Pojo, propertyName: string): Pojo =>
  obj.hasOwnProperty(propertyName) && obj[propertyName]
    ? { ...obj, [propertyName]: obj[propertyName].toLocaleLowerCase() }
    : obj

export const omitDeep = R.curry((obj: object, keys: string[]) => {
  if (keys.length === 0) {
    return obj
  }

  let newObj = R.clone(obj)

  keys.forEach(key => {
    const keyParts = key.split('.')
    newObj = R.dissocPath(keyParts, newObj)
  })

  return newObj
})

export const removeSensitiveAttributes = (inputData: object, excludes: string[]): object => {
  if (excludes.length <= 0) {
    return inputData
  }
  const clonedData = R.clone(inputData)
  return omitDeep(clonedData, excludes)
}
