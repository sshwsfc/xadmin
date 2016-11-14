import widgets from './components'

export default {
  text: {
    component: widgets.Text
  },
  number: {
    component: widgets.Text,
    normalize: (value, previousValue) => {
      return value == '' ? '' : parseFloat(value) || previousValue
    },
    attrs: {
      type: 'number'
    }
  },
  select: {
    component: widgets.Select
  },
  date: {
    component: widgets.DateTime,
    format: 'YYYY-MM-DD',
    attrs: {
      mode: 'date'
    }
  },
  time: {
    component: widgets.DateTime,
    attrs: {
      mode: 'time'
    }
  },
  datetime: {
    component: widgets.DateTime,
    attrs: {
      mode: 'datetime'
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
