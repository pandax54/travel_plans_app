import * as jsonschema from 'jsonschema'
import { user as constraints } from '@app/config/schema-constraints'

const passwordValidator = (input: string): boolean =>
  !(input.length < constraints.passwordMinLength
    || input.length > constraints.passwordMaxLength)

// positive integer including 0
const positiveInteger = (input: string): boolean =>
  /^\d+$/u.test(input)

// positive integer excluding 0
const numericId = (input: string): boolean =>
  /^[1-9]\d*$/u.test(input)

const initValidator = (): jsonschema.Validator => {
  const validator = new jsonschema.Validator()

  // You can define your own schema and add it here. Then you can refer to it in your schemas.
  // https://www.npmjs.com/package/jsonschema
  // validator.addSchema(requiredFailEventSchema, '/requiredFailEvent')

  validator.customFormats.password = passwordValidator
  validator.customFormats.numericId = numericId
  validator.customFormats.positiveInteger = positiveInteger
  return validator
}

export const validator = initValidator()
