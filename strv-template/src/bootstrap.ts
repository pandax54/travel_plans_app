import * as tsConfig from 'tsconfig-paths'
import * as tsConfigJson from '../tsconfig.json' // eslint-disable-line import/extensions

const baseUrl = tsConfigJson.compilerOptions.outDir
const paths = tsConfigJson.compilerOptions.paths

tsConfig.register({
  baseUrl,
  paths,
})
