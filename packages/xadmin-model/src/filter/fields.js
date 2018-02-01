import { TextFilter, EnumFilter, NumberFilter, DateFilter, BooleanFilter } from './components'

export default {
  filter_text: {
    component: TextFilter,
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
    component: EnumFilter
  },
  filter_number: {
    component: NumberFilter
  },
  filter_bool: {
    component: BooleanFilter
  },
  filter_date: {
    component: DateFilter
  },
  filter_datetime: {
    component: DateFilter
  }
}
