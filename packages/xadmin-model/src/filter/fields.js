import widgets from './components'

export default {
  filter_text: {
    component: widgets.TextFilter,
    format: (value, name) => {
      if(value) {
        if(typeof value == 'string') {
          return { text: value, like: false }
        } else {
          return { text: value['like'], like: true }
        }
      } else {
        return { like: false, text: '' }
      }
    },
    parse: (value, name) => {
      if(value) {
        const { text, like } = value
        if(text) {
          return like ? { like: text } : text
        } else {
          return null
        }
      } else {
        return null
      }
    }
  },
  filter_enum: {
    component: widgets.EnumFilter
  },
  filter_number: {
    component: widgets.NumberFilter
  },
  filter_date: {
    component: widgets.DateFilter
  },
  filter_datetime: {
    component: widgets.DateFilter
  }
}
