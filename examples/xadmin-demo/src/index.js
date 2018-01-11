import demo from './plugins'

demo
.use({
  logger: [ (level, message, error) => console[level](error || message) ]
})
.start({ container: '#app' })
