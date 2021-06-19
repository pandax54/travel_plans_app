import * as moment from 'moment'
import App from '@app/api/app' // eslint-disable-line import/newline-after-import
import requestKoa = require('supertest-koa-agent') // eslint-disable-line @typescript-eslint/no-require-imports

const koaApp = new App().app

export const request = (): any => requestKoa(koaApp) // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 *   Outputs string date shifted one year into future
 *   @param {string} dateString Date in format YYYY-MM-DD
 *   @return {string}
 */
export const futureDate = (dateString: string): string => {
  const workingDate = moment(dateString)
  const numberOfYearsToAdd = (moment().year() - workingDate.year()) + 1
  if (numberOfYearsToAdd > 0) {
    workingDate.add(numberOfYearsToAdd, 'years')
  }

  return workingDate.format('YYYY-MM-DD')
}
