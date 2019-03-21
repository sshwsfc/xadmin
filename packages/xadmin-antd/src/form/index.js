import { Checkbox, Select, Text, Transfer } from './components'
import DatePicker from './components/DatePicker'
import DateFilter from './components/DateFilter'
import DatetimePicker from './components/DatetimePicker'
import DatetimeFilter from './components/DatetimeFilter'
import ArrayWidget from './components/Array'

export default {
  form_fields: {
    text: {
      component: Text
    },
    number: {
      component: Text,
      normalize: (value, previousValue) => {
        const ret = parseFloat(value)
        return Number.isNaN(ret) ? value : ret
      },
      attrs: {
        type: 'number',
        style: {
          maxWidth: 200
        }
      }
    },
    integer: {
      component: Text,
      normalize: (value, previousValue) => {
        const ret = parseInt(value)
        return Number.isNaN(ret) ? value : ret
      },
      attrs: {
        type: 'number',
        style: {
          maxWidth: 200
        }
      }
    },
    select: {
      component: Select
    },
    numselect: {
      component: Select,
      normalize: (value, previousValue) => {
        const ret = parseFloat(value)
        return Number.isNaN(ret) ? value : ret
      }
    },
    date: {
      component: DatePicker
    },
    datetime: {
      component: DatetimePicker
    },
    // time: {
    //   component: DateTime,
    //   normalize: (value, previousValue) => {
    //     return (value && value.format) ? value.format('HH:mm:ss') : value || previousValue
    //   },
    //   attrs: {
    //     dateFormat: false,
    //     timeFormat: true,
    //     viewMode: 'time',
    //     valueFormat: 'LT'
    //   }
    // },
    bool: {
      component: Checkbox,
      normalize: (value, previousValue) => {
        return Boolean(value)
      }
    },
    checkbox: {
      component: Checkbox
    },
    relates: {
      component: Transfer
    },
    // fieldset: {
    //   component: Fieldset
    // },
    // array: {
    //   component: ArrayWidget
    // },
    filter_date: {
      component: DateFilter
    },
    filter_datetime: {
      component: DatetimeFilter
    }
  }
}
