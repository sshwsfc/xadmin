import demo from './model'

demo
.use({
  logger: [ (level, message, error) => console[level](error || message) ]
})
.start({ container: '#app' })
