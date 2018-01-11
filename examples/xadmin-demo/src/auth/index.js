import app from 'xadmin-core'

import i18n from 'xadmin-i18n'
import form from 'xadmin-form'
import model from 'xadmin-model'
import layout from 'xadmin-layout'
import auth from 'xadmin-auth'

import api from './api'
import models from './models'

export default app
.use(i18n)
.use(layout)
.use(form)
.use(model)
.use(auth)
.use({
  config: {
    api
  },
  models
})
