import {
  Text,
  Select,
  Checkbox,
  Radios,
  RadioBtn,
  Textarea,
  DateTime,
  Fieldset,
  ArrayWidget
} from './components'

export default {
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
      style: { maxWidth: 200 }
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
      style: { maxWidth: 200 }
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
    component: DateTime,
    normalize: (value, previousValue) => {
      return (value && value.format) ? value.format('YYYY-MM-DD') : value || previousValue
    },
    attrs: {
      dateFormat: true,
      timeFormat: false,
      valueFormat: 'L'
    }
  },
  time: {
    component: DateTime,
    normalize: (value, previousValue) => {
      return (value && value.format) ? value.format('HH:mm:ss') : value || previousValue
    },
    attrs: {
      dateFormat: false,
      timeFormat: true,
      viewMode: 'time',
      valueFormat: 'LT'
    }
  },
  datetime: {
    component: DateTime,
    normalize: (value, previousValue) => {
      return (value && value.format) ? value.format('YYYY-MM-DD HH:mm:ss') : value || previousValue
    },
    attrs: {
      dateFormat: true,
      timeFormat: true,
      valueFormat: 'L LT'
    }
  },
  bool: {
    component: Checkbox,
    normalize: (value, previousValue) => {
      return Boolean(value)
    }
  },
  checkbox: {
    component: Checkbox
  },
  fieldset: {
    component: Fieldset
  },
  array: {
    component: ArrayWidget
  }
}
