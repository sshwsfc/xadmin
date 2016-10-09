import { app } from './index'
import core from './core'
import model from './model'
import filter from './plugins/filter'
import loading from './plugins/loading'

app.load(core)
app.load(model)
app.load(filter)
app.load(loading)

app.start('#app')
