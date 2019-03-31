import app from 'xadmin'

import i18n from 'xadmin-i18n'
import form from 'xadmin-form'
import layout from 'xadmin-ui'
import model from 'xadmin-model'
import auth from 'xadmin-auth'

import relate from 'xadmin-model/lib/relate'
import filter from 'xadmin-model/lib/filter'
import actions from 'xadmin-model/lib/actions'

import search from 'xadmin-model/lib/search'
import modalform from 'xadmin-model/lib/modalform'
import reldetail from 'xadmin-model/lib/reldetail'

import loading from 'xadmin-ui/lib/loading'
import splashscreen from 'xadmin-ui/lib/splashscreen'

export default app
  .use(i18n)
  .use(layout)
  .use(form)
  .use(model)
  .use(auth)
  .use(relate)
  .use(filter)
  .use(search)
  .use(loading)
  .use(modalform)
  .use(actions)
  .use(reldetail)
  .use(splashscreen)
