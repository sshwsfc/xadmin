import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import { Field } from 'redux-form'
import { FieldGroup } from './base'
import { FormControl, Nav, NavItem, Label, Button, OverlayTrigger, Popover } from 'react-bootstrap'

import { DateRange } from 'react-date-range'

const defaultRanges = {
  today: { title: 'Today' },
  yestday: { title: 'Yestday' },
  last_month: { title: 'Last Month' }
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
    this.setState({ value: {} }, (()=>{
      onChange(this.getValue())
    }).bind(this))
  },

  onSelectRange(rule, range) {
    const { onChange } = this.props.input
    const { value } = this.state
    this.setState({ value: { rule } }, (()=>{
      onChange(this.getValue())
    }).bind(this))
  },

  handleSelectRange(dates) {
    const { onChange } = this.props.input
    const format = this.props.field.dateFormat || 'YYYY-MM-DD'
    const { value } = this.state
    this.setState({ value: { 
      rule: 'range', 
      gte: dates['startDate'].format(format).toString(), 
      lt: dates['endDate'].format(format).toString() } 
    }, (()=>{
      onChange(this.getValue())
    }).bind(this))
  },

  renderMini() {
    const { field } = this.props
    const ranges = field.dateRanges || defaultRanges
    const { value } = this.state
    return (
      <div>
        <Button { ...field.attrs } bsStyle={!value.rule?'primary':'default'} onClick={()=>this.clear()} style={{ marginRight: '5px' }}>All</Button>
        <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={
          <Popover style={{ maxWidth: 600 }}>
            {this.renderCalender()}
          </Popover>}>
          <Button { ...field.attrs } bsStyle={value.rule=='range'?'primary' : 'default'} style={{ marginRight: '5px' }}>
            {value.rule == 'range' && value.gte && value.lt ? `${value.gte} ~ ${value.lt}` : 'Select Range' }
          </Button>
        </OverlayTrigger>
        {Object.keys(ranges).map(r => (
          <Button { ...field.attrs } bsStyle={value.rule==r?'primary':'default'} onClick={()=>this.onSelectRange(r, ranges[r])} style={{ marginRight: '5px' }}>{ranges[r].title}</Button>
        ))}
      </div>
    )
  },

  renderBase() {
    const { field } = this.props
    const ranges = field.dateRanges || defaultRanges
    const { value } = this.state
    return (
      <div>
        <Button { ...field.attrs } bsStyle={!value.rule?'primary':'default'} onClick={()=>this.clear()} style={{ marginRight: '5px' }}>All</Button>
        <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={
          <Popover style={{ maxWidth: 600 }}>
            {this.renderCalender()}
          </Popover>}>
          <Button { ...field.attrs } bsStyle={value.rule=='range'?'primary' : 'default'} style={{ marginRight: '5px' }}>
            {value.rule == 'range' && value.gte && value.lt ? `${value.gte} ~ ${value.lt}` : 'Select Range' }
          </Button>
        </OverlayTrigger>
        {Object.keys(ranges).map(r => (
          <Button { ...field.attrs } bsStyle={value.rule==r?'primary':'default'} onClick={()=>this.onSelectRange(r, ranges[r])} style={{ marginRight: '5px' }}>{ranges[r].title}</Button>
        ))}
      </div>
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
    const { input: { name, value, onBlur, onChange, ...inputProps }, label, meta: { touched, error }, field } = this.props
    const { newValue } = this.state

    return (
      <FieldGroup
        id={name}
        label={label}
        error={error}
        help={field.description || field.help}
        control={{ ...field.attrs }} >
        {field.mode == 'mini' ? this.renderMini() : this.renderBase()}
      </FieldGroup>
    )
  }

})
