import { TextFilter, EnumFilter, NumberFilter, DateFilter, DatetimeFilter, BooleanFilter } from './components'

export default {
  form_fields: {
    filter_text: {
      component: TextFilter
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
      component: DatetimeFilter
    }
  }
}
