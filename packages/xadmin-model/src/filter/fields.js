import { TextFilter, EnumFilter, NumberFilter, DateFilter, BooleanFilter } from './components'

export default {
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
    component: DateFilter
  }
}
