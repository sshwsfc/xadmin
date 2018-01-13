import React from 'react'
import { app, StoreWrap } from 'xadmin'

import i18n from 'xadmin-i18n'
import form from 'xadmin-form'
import layout from 'xadmin-layout'
import model from 'xadmin-model'

import filter from 'xadmin-model/lib/filter'
import actions from 'xadmin-model/lib/actions'

import api from 'xadmin-api-jsonplaceholder'
import models from './models'

export default app
.use(i18n)
.use(layout)
.use(form)
.use(model)
.use(filter)
.use(actions)
.use({
  config: {
    api
  },
  models
})
