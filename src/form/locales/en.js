import { en } from 'ajv-i18n'

export default (errors) => {
  en(errors)

  if (!(errors && errors.length)) return
  for (let i = 0 ; i < errors.length; i++) {
    let e = errors[i]
    let out
    let schema = e.schema
    switch (e.keyword) {
      case 'required': {
        const pname = e.params.missingProperty
        out = ((e.schema[pname] && e.schema[pname].title) || pname) + ' should required'
        break
      }
      default:
        continue
    }
    e.message = out
  }

}
