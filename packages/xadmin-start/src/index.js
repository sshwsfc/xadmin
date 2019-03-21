import app from 'xadmin'

import i18n from 'xadmin-i18n'
import form from 'xadmin-form'
import layout from 'xadmin-ui'
import model from 'xadmin-model'
import auth from 'xadmin-auth'

import relate from 'xadmin-model/lib/relate'
import filter from 'xadmin-model/lib/filter'
import actions from 'xadmin-model/lib/actions'

import loading from 'xadmin-plugins/lib/loading'
import search from 'xadmin-plugins/lib/search'
import modalform from 'xadmin-plugins/lib/modalform'
import modeltabs from 'xadmin-plugins/lib/modeltabs'
import reldetail from 'xadmin-plugins/lib/reldetail'
import notice from 'xadmin-plugins/lib/notice'
import splashscreen from 'xadmin-plugins/lib/splashscreen'

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
  .use(notice)
  .use(modalform)
  .use(modeltabs)
  .use(actions)
  .use(reldetail)
  .use(splashscreen)
