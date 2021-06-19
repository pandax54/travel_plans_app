import * as jsonschema from 'jsonschema'
import * as uuidGen from 'uuid'
import { logger } from '@app/utils/logger'
import { removeSensitiveAttributes } from '@app/utils/helpers'
import { validator } from '@app/utils/validator'
import { InvalidRequestError } from '@app/utils/errors'
import { config } from '@app/config'

export abstract class Operation<IN extends object, OUT> {
  protected validationSchema?: jsonschema.Schema

  async execute(inputData: IN): Promise<OUT> {
    const uuid = uuidGen.v1()
    logger.info(
      `${uuid}(${this.constructor.name}) - START EXECUTING... with payload: `,
      removeSensitiveAttributes(inputData, config.logging.sensitiveParameters),
    )

    const startTime = Date.now()
    if (this.validationSchema) {
      this.validationSchema.additionalProperties = false

      const validationErrors = validator.validate(inputData, this.validationSchema).errors
      if (validationErrors.length > 0) {
        logger.info(validationErrors)
        throw new InvalidRequestError('Invalid request data', validationErrors)
      }
    }

    try {
      const result = await this.run(inputData)
      logger.info(`${uuid}(${this.constructor.name}) - DONE (${(Date.now() - startTime).toString()} ms)`)
      return result
    } catch (err) {
      const errorType: string = err.type ?? 'UnknownError'
      logger.error(`${uuid}(${this.constructor.name})
      - ERROR ${errorType} (${(Date.now() - startTime).toString()} ms)`)
      throw err
    }
  }

  protected abstract run(inputData: IN): Promise<OUT>
}
