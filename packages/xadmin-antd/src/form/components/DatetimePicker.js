import React from 'react'
import moment from 'moment'
import { DatePicker } from 'antd'

class DatetimePicker extends React.Component {

  onChange = (value) => {
    const { input, field } = this.props
    const format = field.datetimeFormat || 'YYYY-MM-DD HH:mm:ss'
    input.onChange(value && value.format(format))
  }

  onBlur = (value) => {
    const { input, field } = this.props
    const format = field.datetimeFormat || 'YYYY-MM-DD HH:mm:ss'
    input.onChange(value && value.format(format))
  }

  render() {
    const { input, label, meta, field, group: FieldGroup } = this.props
    const format = field.datetimeFormat || 'YYYY-MM-DD HH:mm:ss'
    return (
      <FieldGroup label={label} meta={meta} input={input} field={field}>
        <DatePicker
          disabledDate={this.disabledStartDate}
          showTime
          format={format}
          placeholder="请选择时间"
          value={input.value ? moment(input.value): null}
          onChange={this.onChange}
          onBlur={input.onBlur}
          style={{minWidth: 230}}
        />
      </FieldGroup>
    )
  }
}

export default DatetimePicker
