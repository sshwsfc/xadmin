import React from 'react'
import moment from 'moment'
import { DatePicker } from 'antd'

class DateRange extends React.Component {

  state = {
    endOpen: false
  }

  disabledStartDate = (startValue) => {
    const { field } = this.props
    const endValue = this.state.endValue
    if (!startValue || !endValue) {
      return false
    }
    if(field.attrs && field.attrs.maxDate && field.attrs.maxDate < startValue) {
      return true
    }
    return startValue.valueOf() > endValue.valueOf()
  }

  disabledEndDate = (endValue) => {
    const { field } = this.props
    const startValue = this.state.startValue
    if (!endValue || !startValue) {
      return false
    }
    if(field.attrs && field.attrs.maxDate && field.attrs.maxDate < endValue) {
      return true
    }
    return endValue.valueOf() <= startValue.valueOf()
  }

  onChange = (fieldKey, newValue) => {
    const { onChange, value } = this.props.input
    const format = this.props.field.datetimeFormat || 'YYYY-MM-DDTHH:mm:ssZ'

    onChange({
      ...value,
      [fieldKey]: newValue.format(format),
      rule: 'range'
    })
  }

  onStartChange = (value) => {
    this.onChange('gte', value)
  }

  onEndChange = (value) => {
    this.onChange('lte', value)
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true })
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open })
  }

  render() {
    const { input, field } = this.props
    const format = field.datetimeFormat || 'YYYY-MM-DD HH:mm:ss'
    const inputValue = input.value

    const { endOpen } = this.state

    const startValue = inputValue && inputValue.gte && moment(inputValue.gte)
    const endValue = inputValue && inputValue.lte && moment(inputValue.lte)

    return (
      <>
        <DatePicker
          disabledDate={this.disabledStartDate}
          showTime
          format={format}
          value={startValue}
          placeholder="起始"
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
        /> 到{' '}
        <DatePicker
          disabledDate={this.disabledEndDate}
          showTime
          format={format}
          value={endValue}
          placeholder="结束"
          onChange={this.onEndChange}
          open={endOpen}
          onOpenChange={this.handleEndOpenChange}
        />
      </>
    )
  }
}

export default DateRange
