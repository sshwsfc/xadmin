import { app } from './index'
import core from './core'
import model from './model'
import filter from './plugins/filter'
import loading from './plugins/loading'
import test from './plugins/test'
import form from './plugins/testform'

app
.use(core)
.use(model)
//.use(filter)
.use(loading)
.use(test)
.use(form)
.start({ container: '#app' })
