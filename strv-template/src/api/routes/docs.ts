import * as path from 'path'
import * as compose from 'koa-compose'
import * as Router from 'koa-router' // eslint-disable-line import/newline-after-import
import serve = require('koa-static2') // eslint-disable-line @typescript-eslint/no-require-imports

export const docsRoutes = compose([
  // Redirect /docs --> /docs/index.html
  new Router().redirect('/docs', '/docs/index.html').routes(),
  serve('docs', path.join(__dirname, '../../../../docs')),
])
