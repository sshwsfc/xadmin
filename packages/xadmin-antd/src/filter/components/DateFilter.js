import React from 'react'
import { DatePicker } from 'antd'
import moment from 'moment'
import _ from 'lodash'
const { MonthPicker, RangePicker, WeekPicker } = DatePicker

export default class DatePickerFilter extends React.Component {

  getValue(value) {
    const { field } = this.props
    const format = field.datetimeFormat || 'YYYY-MM-DD'

    return {
      rule: 'range',
      gte: value[0].format(format),
      lte: value[1].format(format)
    }
  }

  onRangeChange = (value) => {
    const { input } = this.props
    input.onChange(this.getValue(value))
  }

  render() {
    const { input, label, meta, field, group: FieldGroup } = this.props
    let value = input.value
    if(_.isPlainObject(value) && value.gte && value.lte) {
      const format = field.datetimeFormat || 'YYYY-MM-DD'
      value = [ moment(value.gte, format), moment(value.lte, format) ]
    }
    return (
      <FieldGroup label={label} meta={meta} input={input} field={field}>
        <RangePicker onChange={this.onRangeChange} value={value} />
      </FieldGroup>
    )
  }
}
