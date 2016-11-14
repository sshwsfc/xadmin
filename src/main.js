import { app } from './index'
import core from './core'
import model from './model'
import relate from './model/relate'
import form from './form'
import filter from './filter'
import loading from './plugins/loading'
import search from './plugins/search'

import tracs from './tracs'

app
.use(core)
.use(form)
.use(model)
.use(relate)
.use(filter)
.use(search)
.use(loading)
.use(tracs)
.start({ container: '#app' })
