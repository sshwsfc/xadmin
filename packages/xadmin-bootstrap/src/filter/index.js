import { TextFilter, EnumFilter, NumberFilter, DateFilter, BooleanFilter } from './components'
import { FilterForm, NavForm, Submenu, FilterModal } from './filters'

export default {
  components: {
    'Filter.Form': FilterForm,
    'Filter.NavForm': NavForm,
    'Filter.Submenu': Submenu,
    'Filter.Modal': FilterModal
  },
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
      component: DateFilter
    }
  }
}
