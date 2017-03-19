import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import { Field } from 'redux-form'
import { FieldGroup } from './base'
import { FormControl, ButtonGroup, Nav, NavItem, Label, Button, OverlayTrigger, Popover } from 'react-bootstrap'

import { DateRange } from 'react-date-range'

const defaultRanges = {
  today: { title: 'Today', value: (format) => ({
    gte: moment().startOf('day').format(format), 
    lte: moment().endOf('day').format(format)
  }) },
  yestday: { title: 'Yestday', value: (format) => ({
    gte: moment().subtract(1, 'days').startOf('day').format(format), 
    lte: moment().subtract(1, 'days').endOf('day').format(format)
  }) },
  this_month: { title: 'This Month', value: (format) => ({
    gte: moment().startOf('month').format(format), 
    lte: moment().endOf('month').format(format)
  }) }
}

export default React.createClass({

  getInitialState() {
    const value = this.props.input.value
    const mode = this.props.field.mode || 'base'
    return { mode, value }
  },

  getValue() {
    const { value } = this.state
    return value.rule ? value : null
  },

  shouldComponentUpdate(nextProps) {
    return this.props != nextProps
  },

  clear(rule, range) {
    const { onChange } = this.props.input
    const { value } = this.state
    this.setState({ value: {} }, ()=>{
      onChange(this.getValue())
    })
  },

  onSelectRange(rule, range) {
    const { onChange } = this.props.input
    const format = this.props.field.datetimeFormat || 'YYYY-MM-DD HH:mm:ss'
    const { value } = this.state
    this.setState({ value: { rule, ...range.value(format) } }, ()=>{
      onChange(this.getValue())
    })
  },

  handleSelectRange(dates) {
    const { onChange } = this.props.input
    const format = this.props.field.datetimeFormat || 'YYYY-MM-DD HH:mm:ss'
    const { value } = this.state
    this.setState({ value: { 
      rule: 'range', 
      gte: moment(dates['startDate']).startOf('day').format(format).toString(), 
      lte: moment(dates['endDate']).endOf('day').format(format).toString() } 
    }, ()=>{
      onChange(this.getValue())
    })
  },

  renderMini() {
    const { field } = this.props
    const ranges = field.dateRanges || defaultRanges
    const { value } = this.state
    return (
      <ButtonGroup bsSize="xs">
        <Button { ...field.attrs } bsStyle={!value.rule?'primary':'default'} onClick={()=>this.clear()}>All</Button>
        <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={
          <Popover style={{ maxWidth: 600 }}>
            {this.renderCalender()}
          </Popover>}>
          <Button { ...field.attrs } bsStyle={value.rule=='range'?'primary' : 'default'}>
            {value.rule == 'range' && value.gte && value.lt ? `${value.gte} ~ ${value.lt}` : 'Select Range' }
          </Button>
        </OverlayTrigger>
        {Object.keys(ranges).map(r => (
          <Button { ...field.attrs } bsStyle={value.rule==r?'primary':'default'} onClick={()=>this.onSelectRange(r, ranges[r])}>{ranges[r].title}</Button>
        ))}
      </ButtonGroup>
    )
  },

  renderBase() {
    const { field } = this.props
    const ranges = field.dateRanges || defaultRanges
    const { value } = this.state
    return (
      <ButtonGroup bsSize="small">
        <Button { ...field.attrs } bsStyle={!value.rule?'primary':'default'} onClick={()=>this.clear()}>All</Button>
        <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={
          <Popover style={{ maxWidth: 600 }}>
            {this.renderCalender()}
          </Popover>}>
          <Button { ...field.attrs } bsStyle={value.rule=='range'?'primary' : 'default'}>
            {value.rule == 'range' && value.gte && value.lt ? `${value.gte} ~ ${value.lt}` : 'Select Range' }
          </Button>
        </OverlayTrigger>
        {Object.keys(ranges).map(r => (
          <Button { ...field.attrs } bsStyle={value.rule==r?'primary':'default'} onClick={()=>this.onSelectRange(r, ranges[r])}>{ranges[r].title}</Button>
        ))}
      </ButtonGroup>
    )
  },

  renderCalender() {
    return (
        <DateRange
          onChange={this.handleSelectRange}
          theme={{
            Calendar : { width: 200 },
            PredefinedRanges : { marginLeft: 10, marginTop: 10 }
          }}
        />
      )
  },

  render() {
    const { input, label, meta, field, group: FieldGroup } = this.props
    const { newValue } = this.state

    return (
      <FieldGroup label={label} meta={meta} input={input} field={field}>
        {field.mode == 'mini' ? this.renderMini() : this.renderBase()}
      </FieldGroup>
    )
  }

})
