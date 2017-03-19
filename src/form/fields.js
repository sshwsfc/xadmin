import widgets from './components'
Number.isNaN

export default {
  text: {
    component: widgets.Text
  },
  number: {
    component: widgets.Text,
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
    component: widgets.Text,
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
    component: widgets.Select
  },
  numselect: {
    component: widgets.Select,
    normalize: (value, previousValue) => {
      const ret = parseInt(value)
      return Number.isNaN(ret) ? value : ret
    }
  },
  date: {
    component: widgets.DateTime,
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
    component: widgets.DateTime,
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
    component: widgets.DateTime,
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
    component: widgets.Checkbox
  },
  checkbox: {
    component: widgets.Checkbox
  },
  fieldset: {
    component: widgets.Fieldset
  },
  array: {
    component: widgets.ArrayWidget
  }
}
