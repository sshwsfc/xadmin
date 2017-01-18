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
      type: 'number',
      style: { maxWidth: 200 }
    }
  },
  select: {
    component: widgets.Select
  },
  date: {
    component: widgets.DateTime,
    attrs: {
      dateFormat: true,
      timeFormat: false,
      valueFormat: 'L'
    }
  },
  time: {
    component: widgets.DateTime,
    attrs: {
      dateFormat: false,
      timeFormat: true,
      viewMode: 'time',
      valueFormat: 'LT'
    }
  },
  datetime: {
    component: widgets.DateTime,
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
