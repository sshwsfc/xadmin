import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import { InputGroup, FormControl, NavItem, NavDropdown, MenuItem, OverlayTrigger, Popover, Button, Overlay } from 'react-bootstrap'
import DateTimeField from 'react-bootstrap-datetimepicker'
require('react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css')
import DateRangePicker from 'react-bootstrap-daterangepicker'
require('react-bootstrap-daterangepicker/css/daterangepicker.css')
import moment from 'moment'

class FieldFilterManager {
  constructor() {
    this._field_list_filters = []
    this._take_priority_index = 0
  }
  register(filterComponent, take_priority=false) {
    this._field_list_filters.push(filterComponent)
    return filterComponent
  }
  create(field, filter) {
    for (let i = 0; i < this._field_list_filters.length; i++) {
      const filterComponent = this._field_list_filters[i]
      if(filterComponent.test(field, filter)) {
        return filterComponent
      }
    }
  }
}

const manager = new FieldFilterManager()

class BaseFilter extends React.Component {

  constructor(props) {
    super(props)
    this.state = { value: props.value || '' }
  }

  changeFilter(where) {
    const ctx = this.props.context
    let filter = ctx.getModelState().filter
    filter = { ...filter, where: { ...(filter.where || {}), ...where }, skip: 0 }
    ctx.dispatch({ type: 'GET_ITEMS', filter })
  }

  render() {}
}

BaseFilter.propTypes = {
  context: React.PropTypes.object,
  field: React.PropTypes.object,
  filter: React.PropTypes.string,
  value: React.PropTypes.string
}

class ListFilter extends BaseFilter {

  static test(field, filter) {
    return field.enum !== undefined
  }

  onFilte(value) {
    const filter = this.props.filter
    this.changeFilter({ [filter]: value })
  }

  deFilte() {
    const filter = this.props.filter
    this.changeFilter({ [filter]: null })
  }

  choices() {
    let field = this.props.field
      , items = field.enum || []
    return items.map(item => {
      return { value: item, title: _.capitalize(item) }
    })
  }

  render() {
    let ctx = this.props.context
      , model = ctx.model
      , field = this.props.field
      , filter = this.props.filter
      , title = field.name || _.capitalize(filter)
      , overlay = this.choices().map((item) => {
        return <MenuItem key={`${model.name}-${filter}-filter-dropdown-${item.value}`} onClick={this.onFilte.bind(this, item.value)}>{item.title}</MenuItem>
      })
    return (
      <NavDropdown title={title} id={`${model.name}-${filter}-filter-dropdown`}>
        {overlay}
      </NavDropdown>)
  }
}

const ConnListFilter = connect(state => {
  return {}
})(ListFilter)

class StringFilter extends BaseFilter {

  static test(field, filter) {
    return true
  }

  onFilte() {
    const ctx = this.props.context
      , value = this.state.value
      , filter = this.props.filter
    this.changeFilter({ [filter]: { like: `%${value}%` } })
  }

  deFilte() {
    const ctx = this.props.context
      , filter = this.props.filter
    this.changeFilter({ [filter]: null })
  }

  handleChange() {
    this.setState({
      value: this.refs.input.getValue()
    })
  }

  render() {
    let ctx = this.props.context
      , model = ctx.model
      , field = this.props.field
      , filter = this.props.filter
      , title = field.name || _.capitalize(filter)
      , searchBtn = <Button onClick={this.onFilte.bind(this)}>Search</Button>
    return (
      <OverlayTrigger trigger="click" rootClose placement="right" overlay={
          <Popover id={`${model.name}-${filter}-popover`} title={`${title}`}>
            <InputGroup>
              <FormControl value={this.state.value} type="text" ref="input" onChange={this.handleChange.bind(this)} />
              <InputGroup.Button>{searchBtn}</InputGroup.Button>
            </InputGroup>
          </Popover>}>
        <MenuItem>{title}</MenuItem>
      </OverlayTrigger>)
  }
}

class DateFilter extends BaseFilter {

  static test(field, filter) {
    return field.type == 'date'
  }

  constructor(props) {
    super(props)
    this.state = _.merge(this.state, { show: false })
  }

  toggle() {
    this.setState({ show: !this.state.show })
  }

  render() {
    let ctx = this.props.context
      , model = ctx.model
      , field = this.props.field
      , filter = this.props.filter
      , title = field.name || _.capitalize(filter)

    return (<MenuItem ref="target" onClick={this.toggle.bind(this)}>{title}
        <Overlay
          show={this.state.show}
          onHide={() => this.setState({ show: false })}
          placement="right"
          container={this}
          target={() => ReactDOM.findDOMNode(this.refs.target)}
        >
          <DateRangePicker>
              <div>Click Me To Open Picker!</div>
          </DateRangePicker>
        </Overlay>
      </MenuItem>)
  }
}

manager.register(DateFilter)
manager.register(ConnListFilter)
manager.register(StringFilter)

export default manager
